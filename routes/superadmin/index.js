const express = require('express');
const router = express.Router();
const pool = require('../../dbConfig');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const isAuthenticated = require('../../middleware/auth');
const cloudinary = require('../../cloudinaryConfig');
const sendMail = require('../../utils/sendMail');
const dotenv = require('dotenv');

dotenv.config();

// @route /api/v1/superadmin/login
// @desc login super admin
// @access Public
router.post('/login',
 body('email', 'Please include a valid email address').isEmail(),
 body('password', 'Password must be at least 6 character').isLength({ min: 6, max: 32 }), 
 async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const user = await pool.query(`SELECT * FROM superadmins WHERE email = $1`, [req.body.email]);

    if (user.rows.length === 0) return res.status(404).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(req.body.password, user.rows[0].password);

    if (!isMatch) return res.status(404).json({ msg: 'Invalid credentials' });

    const payload = {
      id: user.rows[0].sadmin_id,
      role: user.rows[0].role,
      email: user.rows[0].email,
      name: user.rows[0].name
    }

    jwt.sign(payload, process.env.jwtSecret, { expiresIn: '1h' }, (err, token) => {
      if(err) throw err;
      return res.status(200).json({
        token: token,
        ...payload
      })
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});


// @route /api/v1/superadmin/register
// @desc register super admin
// @access Public
router.post('/register',
  body('name', 'Name is required').isString(),
  body('email', 'Please include a valid email address').isEmail(),
  body('phoneNumber', 'Please include a phone number').isLength({ min: 10, max: 10 }),
  body('password', 'Password must be at least 6 character').isLength({ min: 6, max: 32 }), 
 async (req, res) => {
  try { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const user = await pool.query(`SELECT * FROM superadmins WHERE email = $1`, [req.body.email]);

    if (user.rows.length > 0) return res.status(404).json({ msg: 'User with email already exists' });

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const createdUser = await pool.query(`INSERT INTO superadmins (name, email, password, phone_number, role) VALUES($1, $2, $3, $4, $5) RETURNING *`, [req.body.name, req.body.email, hashedPassword, req.body.phoneNumber, 'superadmin']); 

    return res.status(201).json({ msg: 'Super admin created successfully' });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});


// @route /api/v1/superadmin/createorg
// @desc create organization
// @access Private
router.post('/createorg',
 body('orgName', 'Organization name is required').isString(), 
 body('orgEmail', 'Please include a valid email').isEmail(), 
 body('orgPassword', 'Password must be at least 6 characters').isLength({ min: 6, max: 32 }), 
 body('adminName', 'Admin name is required').isString(),
 body('workId', 'Work ID is required').isNumeric(),
 body('adminEmail', 'Please include a valid email').isEmail(),
 body('adminPassword', 'Password must be at least 6 characters').isLength({ min: 6, max: 32 }), 
 isAuthenticated,
 async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') return res.status(401).json({ msg: 'Unauthorized' });
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const salt = await bcrypt.genSalt();
    const hashedAdminPassword = await bcrypt.hash(req.body.adminPassword, salt);
    const createdAdmin = await pool.query(`INSERT INTO employees(name, work_id, email, password, role) VALUES($1, $2, $3, $4, $5) RETURNING *`, [req.body.adminName, req.body.workId, req.body.adminEmail, hashedAdminPassword, 'orgadmin']);

    const userId = createdAdmin.rows[0].emp_id;

    const hashedOrgPassword = await bcrypt.hash(req.body.orgPassword, salt);
    const createdOrg = await pool.query(`INSERT INTO organizations(org_name, org_email, org_password, emp_id, sadmin_id) VALUES($1, $2, $3, $4, $5) RETURNING *`, [req.body.orgName, req.body.orgEmail, hashedOrgPassword, userId, req.user.id]);

    const empAttachedToOrg = await pool.query(`UPDATE employees SET org_id = $1 WHERE emp_id = $2 RETURNING *`, [createdOrg.rows[0].org_id, userId]); 
    
    return res.status(201).json({ msg: 'Organization created' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});


// @route /api/v1/superadmin/deleteorg/:orgId
// @desc delete organization
// @access Private
router.delete('/deleteorg/:orgId',
isAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') return res.status(401).json({ msg: 'Unauthorized' })
    const deletedOrg = await pool.query(`DELETE FROM organizations WHERE org_id = $1`, [req.params.orgId]);

    if (deletedOrg.rows.length === 0) return res.status(404).json({ msg: 'Organization Not Found' });

    return res.status(200).json({ msg: 'Organization deleted' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});


// @route /api/v1/superadmin/getorgs
// @desc get organizations
// @access Private
router.get('/getorgs', isAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') return res.status(401).json({ msg: 'Unauthorized' });
    const organizations = await pool.query(`SELECT o.*, e.name As administrator FROM organizations o INNER JOIN employees e USING(emp_id)`);
    res.status(200).json(organizations.rows)
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});


// @route /api/v1/superadmin/list
// @desc get all superadmins
// @access Private
router.get('/list', isAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') return res.status(401).json({ msg: 'Unauthorized' });
    const superadmins = await pool.query(`SELECT sadmin_id, name, email, phone_number, profile_photo, role FROM superadmins`);
    res.status(200).json(superadmins.rows)
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});


// @route /api/v1/superadmin/org/status/update/:orgId
// @desc update organization status
// @access Private
router.put('/org/status/update/:orgId',
 body('status', 'Status is required').isBoolean(), 
 isAuthenticated,
 async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') return res.status(401).json({ msg: 'Unauthorized' });

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const organization = await pool.query(`UPDATE organizations SET org_status = $1 WHERE org_id = $2 RETURNING *`, [req.body.status, req.params.orgId]);

    return res.status(200).json(organization.rows[0]);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});


// @route /api/v1/superadmin/profile
// @desc Get my profile
// @access Private
router.get('/profile', isAuthenticated, async (req, res) => {
  try { 
    const profile = await pool.query(`SELECT sadmin_id, name, email, profile_photo, role, phone_number FROM superadmins WHERE sadmin_id = $1`, [req.user.id ]);

    return res.status(200).json(profile.rows[0]);

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});


// @route /api/v1/superadmin/getusers
// @desc Get all users 
// @access Private
router.get('/getusers', isAuthenticated, async (req, res) => {
  try { 
    const users = await pool.query(`SELECT emp_id, name, email, profile_photo, role, work_id, org_id, department FROM employees`);

    return res.status(200).json(users.rows);

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});


// @route /api/v1/superadmin/orgadmins
// @desc Get all admins 
// @access Private
router.get('/orgadmins', isAuthenticated, async (req, res) => {
  try { 
    const users = await pool.query(`SELECT emp_id, name, email, profile_photo, role, work_id, org_id, department FROM employees WHERE role = $1`, ['orgadmin']);

    return res.status(200).json(users.rows);

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});


// @route /api/v1/superadmin/issues
// @desc Get all issues 
// @access Private
router.get('/issues', isAuthenticated, async (req, res) => {
  try { 
    const issues = await pool.query(`SELECT * FROM issues ORDER BY issue_id`);

    return res.status(200).json(issues.rows);

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});

// @route /api/v1/superadmin/issuesraisedtome
// @desc Get all issues raised to me
// @access Private
router.get('/issuesraisedtome', isAuthenticated, async (req, res) => {
  try { 
    const issues = await pool.query(`SELECT * FROM issues WHERE recipient_id = $1 ORDER BY issue_id`, [req.user.id]);

    return res.status(200).json(issues.rows);

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});


// @route /api/v1/superadmin/avatar
// @desc update avatar
// @access Private
router.put('/avatar', body('base64EncodedImage', "base64EncodedImage is required").isString() ,isAuthenticated, async (req, res) => {
  try { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const avatarUrl = await cloudinary.uploader.upload(req.body.base64EncodedImage);

    const profile = await pool.query(`UPDATE superadmins SET profile_photo = $1 WHERE sadmin_id = $2 RETURNING *`, [avatarUrl.secure_url, req.user.id]); 

    return res.status(200).json({msg: "Profile photo uploaded successfully"});

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});


// @route /api/v1/superadmin/resolveissue/:issueId
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

// @route /api/v1/superadmin/forgotpassword
// @desc forgot password
// @access Public
router.post('/forgotpassword',
 body('email', "Please include a valid email address").isEmail(),
 isAuthenticated, async (req, res) => {
  try { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const user = await pool.query(`SELECT * FROM superadmins WHERE email = $1`, [req.body.email]);

    if(user.rows.length === 0) return res.status(404).json({ msg: 'User Not Found' });
    
    const {
      randomBytes,
    } = await import('crypto');

    const buf = await randomBytes(32);
    const resetToken = buf.toString('hex');

    const salt = await bcrypt.genSalt();
    const hashToken = await bcrypt.hash(resetToken, salt);
    const expiresTime = Date.now() + 10 * 60 * 1000;
    const expiresIn = new Date(expiresTime).toISOString();
    const requestAt = Date.now().toString();

    await pool.query(`UPDATE superadmins SET password_reset_token = $1, password_expires_time = $2 WHERE sadmin_id = $3`, [hashToken, expiresIn, user.rows[0].sadmin_id]);

    const emailLink = `${process.env.HOSTED_PUBLIC_URL}/resetpassword?resetToken=${resetToken}&userId=${user.rows[0].sadmin_id}&requestAt=${requestAt}&expiresIn=${expiresIn}`;
    console.log(emailLink);

    await sendMail(user.rows[0].email, user.rows[0].name, emailLink);

    return res.status(200).json({msg: "Instructions sent successfully"});

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});


// @route /api/v1/superadmin/resetpassword
// @desc forgot password
// @access Public
router.post('/resetpassword',
 body('password', 'Password should be at least 6 characters').isLength({ min: 6, max: 32 }), 
 body('userId', 'User ID is required integer').isNumeric(),
 body('resetToken', 'Reset Token is required'), 
 async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const user = await pool.query('SELECT * FROM superadmins WHERE sadmin_id = $1', [req.body.userId]);

    if (user.rows.length === 0) return res.status(404).json({ msg: 'User Not Found' });

    const isMatch = await bcrypt.compare(req.body.resetToken, user.rows[0].password_reset_token);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Token or token has expired' });

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    await pool.query(`UPDATE superadmins SET password = $1, password_reset_token = $2, password_expires_time = $3 WHERE sadmin_id = $4`,[hashedPassword, null, null, user.rows[0].sadmin_id]);

    return res.status(200).json({msg: "Password reset successfully"});

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
})

module.exports = router;