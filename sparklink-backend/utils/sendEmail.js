const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,  // Set this in your .env file
        pass: process.env.EMAIL_PASS   // Set this in your .env file
    }
});

const sendEmail = async ({ to, subject, text }) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: Array.isArray(to) ? to.join(', ') : to,
            subject,
            text
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent to: ${to}`);
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};

module.exports = sendEmail;
