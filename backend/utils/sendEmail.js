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
      html: `
      <div style="font-family: Arial, sans-serif; background:#f5f7fa; padding:20px;">
        <div style="max-width:500px; margin:auto; background:#ffffff; padding:25px; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          
          <h2 style="color:#333; text-align:center; margin-bottom:20px;">
            🔐 Email Verification
          </h2>

          <p style="font-size:16px; color:#555;">
            Hello,
          </p>

          <p style="font-size:16px; color:#555;">
            Here is your verification code:
          </p>

          <div style="text-align:center; margin:25px 0;">
            <span style="display:inline-block; padding:12px 25px; background:#4f46e5; color:white; font-size:24px; 
            letter-spacing:3px; border-radius:8px;">
              ${otp}
            </span>
          </div>

          <p style="font-size:15px; color:#555;">
            This code will expire in <b>10 minutes</b>.  
            If you didn’t request this, please ignore this email.
          </p>

          <hr style="border:none; border-top:1px solid #eee; margin:25px 0;">

          <p style="font-size:13px; color:#999; text-align:center;">
            © ${new Date().getFullYear()} Your App — All rights reserved.
          </p>

        </div>
      </div>
      `
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.log("Email not sent", error);
  }
};

module.exports = sendEmail;