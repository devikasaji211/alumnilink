const nodemailer = require('nodemailer');
require('dotenv').config(); // Ensure environment variables are loaded

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Use email from .env
    pass: process.env.EMAIL_PASS, // Use App Password from .env
  },
});

const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Use email from .env
    to: email,
    subject: 'OTP for Registration',
    text: `Your OTP for registration is: ${otp}. It will expire in 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent successfully');
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw new Error('Failed to send OTP');
  }
};

module.exports = { sendOtpEmail };
