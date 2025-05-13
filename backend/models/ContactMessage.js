const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { 
        type: String, 
        required: true, 
        trim: true, 
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Invalid email format"]  // Email validation
    },
    message: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now }
});

// Indexing for better query performance (optional)
contactMessageSchema.index({ email: 1, createdAt: -1 });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
