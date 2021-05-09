const jwt = require("jsonwebtoken");
require("dotenv").config(); //access all your env variables

function jwtGenerator (emp_id, sadmin_id, role){
    const payload = {
        user:emp_id || sadmin_id,
        role:role
    }
    return jwt.sign(payload, process.env.jwtSecret, {expiresIn:"1 hr"});
};

module.exports = jwtGenerator;