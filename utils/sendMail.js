const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();

const sendMail = async (userEmail, username, emailLink) => {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: `${process.env.NODEMAILER_AUTH_USER}`,
        pass: `${process.env.NODEMAILER_AUTH_PWD}`,
      },
      tls: {
        rejectUnauthorized:false
      }
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `"Akasi Systems" <${process.env.NODEMAILER_AUTH_USER}>`, // sender address
      to: userEmail, // list of receivers
      subject: "Password Reset Request", // Subject line
      text: "Hello world?", // plain text body
      html: `<p>Hi ${username}</p>
             <p>You requested to reset your password</p> 
             <p>Please click the link below to reset reset your password. It expires in 10 minutes</p>
             <a href=${emailLink}>Reset Password</a>
             <p>If it was not you ignore this mail</p>
      `, // html body
    });
  
    console.log("Message sent: %s", info.messageId); 
    return info;
  } catch (error) {
    console.log(error)
  }
}

module.exports = sendMail;