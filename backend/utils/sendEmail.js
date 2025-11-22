require('dotenv').config()

const nodemailer = require('nodemailer');

const sendEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_USER , 
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: 'vadamlbir@gmail.com',
      to: email,
      subject: 'Your Verification Code',
      text: `Your verification code is: ${otp}. It expires in 10 minutes.`,
      html: `<h3>Your verification code is: <b>${otp}</b></h3><p>It expires in 10 minutes.</p>`
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.log("Email not sent", error);
  }
};

module.exports = sendEmail;