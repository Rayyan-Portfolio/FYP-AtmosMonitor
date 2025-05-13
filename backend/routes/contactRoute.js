const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/', async (req, res, next) => {
    try {
        console.log("📩 Incoming contact form submission:", req.body);
        await contactController.submitMessage(req, res);
    } catch (error) {
        console.error("❌ Error in contactRoute.js:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
