const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.getContactInfo = (req, res) => {
    try {
        const contactDetails = {
            email: process.env.EMAIL_RECEIVER,
            phone: "+1 123-456-7890",
            address: "123 SparkLink Ave, Windsor, ON"
        };
        res.status(200).json(contactDetails);
    } catch (error) {
        console.error("Error fetching contact details:", error);
        res.status(500).json({ message: "Error fetching contact details" });
    }
};

exports.submitContactForm = async (req, res) => {
    try {
        console.log("📩 Contact Form Submission Received:");
        console.log("Request Body:", req.body);

        if (!req.body.name || !req.body.email || !req.body.message) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        console.log("⚡ Email Config:");
        console.log("User:", process.env.EMAIL_USER);
        console.log("Receiver:", process.env.EMAIL_RECEIVER);
    
        const { name, email, message } = req.body;
    
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_RECEIVER,
          subject: `New Contact Form Submission from ${name}`,
          text: `You have received a new message:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        };
    
        console.log("📩 Sending email...");
        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully!");
    
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error("❌ Error sending email:", error);
        res.status(500).json({ message: 'Error sending email', error: error.message });
    }
};