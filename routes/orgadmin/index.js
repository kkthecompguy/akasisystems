const express = require('express');
const router = express.Router();
const pool = require('../../dbConfig');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const isAuthenticated = require('../../middleware/auth');
const cloudinary = require('../../cloudinaryConfig');


// @route /api/v1/orgadmin/login
// @desc login org admin
// @access Public
router.post('/login',
 body('email', 'Please include a valid email address').isEmail(),
 body('password', 'Password must be at least 6 character').isLength({ min: 6, max: 32 }), 
 async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const user = await pool.query(`SELECT * FROM employees WHERE email = $1`, [req.body.email]);
    if (user.rows.length === 0) return res.status(404).json({ msg: 'Invalid Credentials' });

    if (user.rows[0].role !== 'orgadmin') return res.status(404).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(req.body.password, user.rows[0].password);
    if (!isMatch) return res.status(404).json({ msg: 'Invalid credentials' });

    const organization = await pool.query(`SELECT * FROM organizations WHERE emp_id = $1`, [user.rows[0].emp_id]);

    const payload = {
      id: user.rows[0].emp_id,
      role: user.rows[0].role,
      email: user.rows[0].email,
      name: user.rows[0].name
    }

    jwt.sign(payload, process.env.jwtSecret, { expiresIn: '1h' }, (err, token) => {
      if(err) throw err;
      return res.status(200).json({
        token: token,
        ...payload,
        organizationId: organization.rows[0].org_id
      });
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});


// @route /api/v1/orgadmin/forgotPassword
// @desc forgot password
// @access Public
router.post('/forgotpassword',
 body('email', 'Please include a email address').isEmail(), 
 async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    // @todo add forgot password logic
    res.send(req.body)
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});


// @route /api/v1/orgadmin/resetpassword
// @desc reset password
// @access Public
router.post('/resetpassword',
 body('resetToken', 'Reset Token is required').isString(),
 body('tokenExpiry', 'Token Expiry is required').isString(), 
 body('userId', 'Please include a email address').isEmail(), 
 async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    // @todo add reset password logic
    res.send(req.body);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});



// @route /api/v1/orgadmin/update/info
// @desc update admin info
// @access Private
router.put('/update/info',
 body('oldPassword', 'Password must be at least 6 character').isLength({ min: 6, max: 32 }), 
 body('newPassword', 'Password must be at least 6 character').isLength({ min: 6, max: 32 }),  
 isAuthenticated, 
 async (req, res) => {
  try {
    if (req.user.role !== "orgadmin") return res.status(401).json({ msg: 'Unauthorized' });
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    let userEmail = req.body.email ? req.body.email : req.user.email;

    const user = await pool.query(`SELECT * FROM employees WHERE emp_id = $1`, [req.user.id]);
    const isMatch = await bcrypt.compare(req.body.oldPassword, user.rows[0].password);
    if (!isMatch) return res.status(400).json({ msg: 'Given password is incorrect' });

    const salt = await bcrypt.genSalt();
    const hashedAdminPassword = await bcrypt.hash(req.body.newPassword, salt);

    const updatedAdmin = await pool.query(`UPDATE employees SET password = $1, email = $2 WHERE emp_id = $3 RETURNING *`, [hashedAdminPassword, userEmail, req.user.id]);

    return res.status(200).json({ msg: 'Admin Info Updated Successfully' });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});


// @route /api/v1/orgadmin/update/org
// @desc update org info
// @access Private
router.put('/update/org',
 body('base64EncodedImage', 'Organization logo is required').isString(), 
 body('theme', 'Theme is required').isString(),  
 isAuthenticated, 
 async (req, res) => {
  try {
    if (req.user.role !== "orgadmin") return res.status(401).json({ msg: 'Unauthorized' });
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const logoUrl = await cloudinary.uploader.upload(req.body.base64EncodedImage);

    const updatedOrg = await pool.query(`UPDATE organizations SET logo = $1, colour_scheme = $2 WHERE emp_id = $3 RETURNING *`, [logoUrl.secure_url, req.body.theme, req.user.id]);
    console.log(updatedOrg.rows[0]);

    return res.status(200).json({ msg: 'Organization Info Updated Successfully' });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});


// @route /api/v1/orgadmin/adduser
// @desc add user to org
// @access Private
router.post('/adduser',
 body('name', 'Name is required').isString(),
 body('workId', 'workId is required').isString(), 
 body('email', 'Please include a valid email address').isEmail(), 
 body('password', 'Password must be at least 6 characters').isLength({ min: 6, max: 32 }), 
 body('role', 'User role can either be supervisor, manager or user').isString(), 
 body('department', 'Department is required').isString(), 
 body('organization', 'Organization is required').isNumeric(),
 isAuthenticated,
 async (req, res) => {
  try {
    if (req.user.role !== "orgadmin") return res.status(401).json({ msg: 'Unauthorized' });
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const createdUser = await pool.query(`INSERT INTO employees(name, email, password, role, work_id, department, org_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [req.body.name, req.body.email, hashedPassword, req.body.role, req.body.workId, req.body.department, req.body.organization]); 

    return res.status(201).json({ msg: 'User Created Successfully' });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});


// @route /api/v1/orgadmin/users
// @desc get all users
// @access Private
router.get('/users', isAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== "orgadmin") return res.status(401).json({ msg: 'Unauthorized' });

    const organization = await pool.query(`SELECT * FROM organizations WHERE emp_id = $1`,[req.user.id]);

    const users = await pool.query(`SELECT emp_id, name, email, profile_photo, role, work_id, department, org_id FROM employees WHERE org_id = $1`, [organization.rows[0].org_id]);
    return res.status(200).json(users.rows);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});

// @route /api/v1/orgadmin/issues
// @desc get all issues
// @access Private
router.get('/issues', isAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== "orgadmin") return res.status(401).json({ msg: 'Unauthorized' });

    const organization = await pool.query(`SELECT * FROM organizations WHERE emp_id = $1`, [req.user.id]); 
    const issues = await pool.query(`SELECT * FROM issues WHERE org_id = $1 ORDER BY issue_id`, [organization.rows[0].org_id]);
    return res.status(200).json(issues.rows);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});


// @route /api/v1/orgadmin/organization
// @desc get organization profile
// @access Private
router.get('/organization', isAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== "orgadmin") return res.status(401).json({ msg: 'Unauthorized' });

    const organization = await pool.query(`SELECT org_id, org_name, org_email, emp_id, sadmin_id, colour_scheme, logo, org_status FROM organizations WHERE emp_id = $1`, [req.user.id]);
    return res.status(200).json(organization.rows[0]);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});


// @route /api/v1/orgadmin/avatar
// @desc update avatar
// @access Private
router.put('/avatar', body('base64EncodedImage', "base64EncodedImage is required").isString() ,isAuthenticated, async (req, res) => {
  try { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const avatarUrl = await cloudinary.uploader.upload(req.body.base64EncodedImage);

    const profile = await pool.query(`UPDATE employees SET profile_photo = $1 WHERE emp_id = $2 RETURNING *`, [avatarUrl.secure_url, req.user.id]);
    console.log(profile.rows[0]);

    return res.status(200).json({msg: "Profile photo uploaded successfully"});

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});

// @route /api/v1/orgadmin/resolveissue/:issueId
// @desc resolve issue
// @access Private
router.put('/resolveissue/:issueId', body('message', "Message is required").isString() ,isAuthenticated, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const resolveDate = new Date().toISOString();
    const resolvedIssue = await pool.query(`UPDATE issues SET resolve_message = $1, status = $2, resolve_date = $3 WHERE issue_id = $4 RETURNING *`, [req.body.message, true, resolveDate ,req.params.issueId]);

    return res.status(200).json({msg: "Issue resolved successfully"});

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});

module.exports = router;