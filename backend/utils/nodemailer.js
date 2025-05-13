const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

// Configure transporter with environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,  // Use environment variable
        pass: process.env.EMAIL_PASS   // Use environment variable (app password)
    }
});

// Send email function with proper error handling
exports.sendEmail = async ({ to, subject, text }) => {
    try {
        const mailOptions = { from: process.env.EMAIL_USER, to, subject, text };
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to}: ${info.response}`);
        return info;
    } catch (error) {
        console.error(`❌ Error sending email to ${to}:`, error);
        throw new Error("Email sending failed.");
    }
};
