const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');  // Import UUID for generating unique token IDs
const ContactRequest = require('../models/ContactRequest');  // Import the ContactRequest model
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const getContactInfo = (req, res) => {
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

const submitContactForm = async (req, res) => {
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
        const tokenId = uuidv4();  // Generate a unique token ID

        // Save request to database
        await ContactRequest.create({
            tokenId,
            name,
            email,
            message
        });

        console.log("✅ Contact request stored with Token ID:", tokenId);

        // 📧 Email to the User
        const userMailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: `Your Contact Request Has Been Received`,
          html: `
            <p>Dear ${name},</p>
            <p>Thank you for reaching out to SparkLink! We've received your message and will get back to you shortly.</p>
            <p><strong>📩 Your Message:</strong></p>
            <blockquote style="margin: 10px 0; padding: 12px; background-color: #f9f9f9; border-left: 4px solid #007bff;">
                ${message}
            </blockquote>
            <p><strong>🔹 Token ID:</strong> ${tokenId}</p>
            <p>If you didn’t make this request, please ignore this email.</p>
            <p>Regards,<br>SparkLink Support Team</p>
            `
        };

        // 📧 Email to the Receiver
        const receiverMailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_RECEIVER,
          subject: `New Contact Request - Token ID: ${tokenId}`,
          html: `
            <p>Hello Admin,</p>
            <p>A new contact request has been submitted on SparkLink. Here are the details:</p>
            <ul>
            <li><strong> Name:</strong> ${name}</li>
            <li><strong> Email:</strong> ${email}</li>
            <li><strong> Token ID:</strong> ${tokenId}</li>
            </ul>
            <p><strong>📩 Message:</strong></p>
            <blockquote style="margin: 10px 0; padding: 12px; background-color: #f9f9f9; border-left: 4px solid #28a745;">
            ${message}
            </blockquote>
            <p>Please follow up with the user at your earliest convenience.</p>
            <p>Regards,<br>SparkLink System</p>
        `
        };

        console.log("📩 Sending emails...");
        await transporter.sendMail(userMailOptions);
        await transporter.sendMail(receiverMailOptions);
        console.log("✅ Emails sent successfully!");

        res.status(200).json({ message: 'Request submitted successfully!', tokenId });
    } catch (error) {
        console.error("❌ Error processing contact form:", error);
        res.status(500).json({ message: 'Error submitting contact request', error: error.message });
    }
};

// ✅ Export all functions correctly
module.exports = { getContactInfo, submitContactForm };
