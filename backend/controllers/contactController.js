const ContactMessage = require('../models/ContactMessage');
const nodemailer = require('../utils/nodemailer');

// Submit contact form
exports.submitMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validate input fields
        if (!name || !email || !message) {
            return res.status(400).json({ error: "All fields (name, email, message) are required." });
        }

        // Save message to database
        const newMessage = new ContactMessage({ name, email, message });
        await newMessage.save();

        // Send confirmation email to user
        try {
            await nodemailer.sendEmail({
                to: email,
                subject: 'Message Received - AtmosMonitor',
                text: `Dear ${name},\n\nWe have received your message and will get back to you soon.\n\nThank you!`
            });
        } catch (emailError) {
            console.error("⚠️ Error sending confirmation email:", emailError);
            return res.status(500).json({ error: "Message saved but email confirmation failed." });
        }

        // Send message to admin
        try {
            await nodemailer.sendEmail({
                to: 'atmosmonitor@gmail.com',  // Admin's email
                subject: 'New Contact Message',
                text: `New message from ${name} (${email}):\n\n${message}`
            });
        } catch (adminEmailError) {
            console.error("⚠️ Error sending admin notification:", adminEmailError);
        }

        res.status(200).json({ message: 'Your message has been sent successfully!' });

    } catch (error) {
        console.error("❌ Error in contact form submission:", error);
        res.status(500).json({ error: "Error submitting your message. Please try again later." });
    }
};
