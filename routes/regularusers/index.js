const fs = require("fs");
const path = require('path')
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
const pdf = require("pdf-creator-node");
const pdfTemplate = require('../../utils/document');

dotenv.config();

// @route /api/v1/:role/login
// @desc login regular user
// @access Public
router.post('/:role/login',
 body('email', 'Please include a valid email address').isEmail(),
 body('password', 'Password must be at least 6 character').isLength({ min: 6, max: 32 }), 
 async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const user = await pool.query(`SELECT * FROM employees WHERE email = $1`, [req.body.email])
    if (user.rows.length === 0) return res.status(404).json({ msg: 'Invalid credentials' });
    if (user.rows[0].role === 'orgadmin') return res.status(401).json({ msg: 'Unauthorzed' })

    const isMatch = await bcrypt.compare(req.body.password, user.rows[0].password);
    if (!isMatch) return res.status(404).json({ msg: 'Invalid credentials' });

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
        ...payload
      })
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});


// @route /api/v1/users/forgotPassword
// @desc forgot password
// @access Public
router.post('/forgotpassword',
 body('email', 'Please include a email address').isEmail(), 
 async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const user = await pool.query(`SELECT * FROM employees WHERE email = $1`, [req.body.email]);

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

    await pool.query(`UPDATE employees SET password_reset_token = $1, password_expires_time = $2 WHERE emp_id = $3`, [hashToken, expiresIn, user.rows[0].emp_id]);

    const emailLink = `${process.env.HOSTED_PUBLIC_URL}/resetpassword?resetToken=${resetToken}&userId=${user.rows[0].emp_id}&requestAt=${requestAt}&expiresIn=${expiresIn}`;
    console.log(emailLink);

    await sendMail(user.rows[0].email, user.rows[0].name, emailLink);

    return res.status(200).json({msg: "Instructions sent successfully"});
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});


// @route /api/v1/users/resetpassword
// @desc reset password
// @access Public
router.post('/resetpassword',
  body('password', 'Password should be at least 6 characters').isLength({ min: 6, max: 32 }), 
  body('userId', 'User ID is required integer').isNumeric(),
  body('resetToken', 'Reset Token is required'), 
 async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const user = await pool.query('SELECT * FROM employees WHERE emp_id = $1', [req.body.userId]);

    if (user.rows.length === 0) return res.status(404).json({ msg: 'User Not Found' });

    const isMatch = await bcrypt.compare(req.body.resetToken, user.rows[0].password_reset_token);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Token or token has expired' });

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    await pool.query(`UPDATE employees SET password = $1, password_reset_token = $2, password_expires_time = $3 WHERE emp_id = $4`,[hashedPassword, null, null, user.rows[0].emp_id]);

    return res.status(200).json({msg: "Password reset successfully"});
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});


// @route /api/v1/users/update/info
// @desc update user info
// @access Private
router.put('/update/info',
 body('oldPassword', 'Password must be at least 6 character').isLength({ min: 6, max: 32 }), 
 body('newPassword', 'Password must be at least 6 character').isLength({ min: 6, max: 32 }),  
 isAuthenticated, 
 async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    let userEmail = req.body.email ? req.body.email : req.user.email;
    console.log(userEmail);

    const user = await pool.query(`SELECT * FROM employees WHERE emp_id = $1`, [req.user.id]);
    const isMatch = await bcrypt.compare(req.body.oldPassword, user.rows[0].password);
    if (!isMatch) return res.status(400).json({ msg: 'Given password is incorrect' });

    const salt = await bcrypt.genSalt();
    const hashedUserPassword = await bcrypt.hash(req.body.newPassword, salt);

    const updatedUser = await pool.query(`UPDATE employees SET password = $1, email = $2 WHERE emp_id = $3 RETURNING *`, [hashedUserPassword, userEmail, req.user.id]);
    console.log(updatedUser.rows[0]);

    return res.status(200).json({ msg: 'user Info Updated Successfully' });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});


// @route /api/v1/users/create/issue
// @desc create issue
// @access Private
router.post('/create/issue',
 body('message', 'Message is required').isString(),
 body('title', 'Title is required').isString(),
 body('location', 'Priority is required').isString(),
 body('createdAt', 'CreatedAt is required').isString(), 
 body('recipient', 'Recipient is required').isNumeric(),
 body('orgId', 'Organization ID is required').isNumeric(),
 body('category', 'Category is required').isString(),
 body('priority', 'Priority is required').isString(),
 isAuthenticated, 
 async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    console.log({priority: req.body.priority}, {category:req.body.category})
    let photoUrl;
    if (req.body.base64EncodedImage) {
      photoUrl = await cloudinary.uploader.upload(req.body.base64EncodedImage);
    } 

    const user = await pool.query(`SELECT * FROM employees WHERE emp_id = $1`, [req.user.id]);

    const createdIssue = await pool.query(`INSERT INTO issues(creator_id, recipient_id, creator_location, message, date_created, org_id, title, category, priority, photos) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, [req.user.id, req.body.recipient, req.body.location, req.body.message, req.body.createdAt, req.body.orgId, req.body.title, req.body.category, req.body.priority, photoUrl.secure_url ]); 

    return res.status(201).json({ msg: 'Issue created successfully' });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});


// @route /api/v1/users/resolve/issue/:issueId
// @desc resolve issue
// @access Private
router.post('/resolve/issue/:issueId',
 body('message', 'Message is required').isString(),
 isAuthenticated, 
 async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const resolveDate = new Date().toISOString();
    const resolvedIssue = await pool.query(`UPDATE issues SET resolve_message = $1, status = $2, resolve_date = $3 WHERE issue_id = $4 RETURNING *`, [req.body.message, true, resolveDate ,req.params.issueId]);
    console.log(resolvedIssue.rows[0]);
    
    return res.status(201).json({ msg: 'Issue created successfully' });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});


// @route /api/v1/users/myissues
// @desc my issue
// @access Private
router.get('/myissues', isAuthenticated, async (req, res) => {
  try { 
    const issues = await pool.query(`SELECT * FROM issues WHERE creator_id = $1 ORDER BY issue_id`, [req.user.id ]);

    return res.status(200).json(issues.rows);

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});


// @route /api/v1/users/issuesraisedtome
// @desc Issues raised to me
// @access Private
router.get('/issuesraisedtome', isAuthenticated, async (req, res) => {
  try { 
    const issues = await pool.query(`SELECT * FROM issues WHERE recipient_id = $1 ORDER BY issue_id`, [req.user.id ]);

    return res.status(200).json(issues.rows);

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});

// @route /api/v1/users/profile
// @desc Get my profile
// @access Private
router.get('/profile', isAuthenticated, async (req, res) => {
  try { 
    const profile = await pool.query(`SELECT emp_id, name, email, profile_photo, role, work_id, department FROM employees WHERE emp_id = $1`, [req.user.id ]);

    return res.status(200).json(profile.rows[0]);

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});

// @route /api/v1/users/avatar
// @desc update avatar
// @access Private
router.put('/avatar', body('base64EncodedImage', "base64EncodedImage is required").isString() ,isAuthenticated, async (req, res) => {
  try { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const avatarUrl = await cloudinary.uploader.upload(req.body.base64EncodedImage);

    const profile = await pool.query(`UPDATE employees SET profile_photo = $1 WHERE emp_id = $2 RETURNING *`, [avatarUrl.secure_url, req.user.id]); 

    return res.status(200).json({msg: "Profile photo uploaded successfully"});

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});


// @route /api/v1/users/organization
// @desc get organization profile
// @access Private
router.get('/organization', isAuthenticated, async (req, res) => {
  try {
    const user = await pool.query(`SELECT * FROM employees WHERE emp_id = $1`, [req.user.id]);

    const organization = await pool.query(`SELECT * FROM organizations WHERE org_id = $1`, [user.rows[0].org_id]);

    const orgSupervisor = await pool.query(`SELECT * FROM employees WHERE org_id = $1 AND role = $2`, [organization.rows[0].org_id, "supervisor"]);

    const orgManager = await pool.query(`SELECT * FROM employees WHERE org_id = $1 AND role = $2`, [organization.rows[0].org_id, "manager"]);

    const response = {
      org_id: organization.rows[0].org_id,
      org_name: organization.rows[0].org_name,
      org_email: organization.rows[0].org_email,
      org_admin: organization.rows[0].emp_id,
      org_superadmin: organization.rows[0].sadmin_id,
      colour_scheme: organization.rows[0].colour_scheme,
      logo: organization.rows[0].logo,
      org_status: organization.rows[0].org_status,
      supervisor: orgSupervisor.rows[0] ? orgSupervisor.rows[0].emp_id : undefined,
      manager: orgManager.rows[0] ? orgManager.rows[0].emp_id : undefined
    }
    return res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
});


// @route /api/v1/users/reports
// @desc generate report
// @access Private
router.post('/reports', body('issues', 'Issues are required').isArray(), isAuthenticated, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const html = fs.readFileSync("utils/report.html", "utf8");
    let options = {
      format: "A4",
      orientation: "portrait",
      border: "10mm"
    };
    let document = {
      html: html,
      data: {
        issues: req.body.issues,
      },
      path: "./report.pdf",
      type: "",
    };
    pdf
      .create(document, options)
      .then((resp) => {
        var file = fs.createReadStream('report.pdf');
        var stat = fs.statSync('report.pdf');
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
        file.pipe(res);
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
})

// @route /api/v1/users/reports
// @desc get generate report
// @access Private
router.get('/reports', isAuthenticated, async(req, res) => {
  try {
    let file = fs.createReadStream('report.pdf');
    let stat = fs.statSync('report.pdf');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
    file.pipe(res)
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error.message, status: error.status });
  }
})
module.exports = router;