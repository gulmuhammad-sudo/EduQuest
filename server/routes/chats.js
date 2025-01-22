const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require("path");
const User = require('../models/User');
const Chat = require('../models/Chat');


// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  
    },
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);
        cb(null, file.filename + '-' + Date.now() + extension);
    }
});
const upload = multer({ storage: storage });

// Endpoint to fetch chats
router.get('/', async (req, res) => {
    try {
        const chats = await Chat.find().populate('user', 'name email');
        res.json(chats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chats' });
    }
});

// Endpoint to send message with optional attachment
router.post('/', upload.single('attachment'), async (req, res) => {
    console.log(req.body)
    try {
        const user = req.user;
        const { message } = req.body;
        const attachmentUrl = req.file ? `/uploads/${req.file.filename}` : null;       
            const newChat = new Chat({
                message: message,
                user: user._id,
                attachmentUrl: attachmentUrl
            });
            await newChat.save();
            res.status(201).json(newChat);
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
        console.error(JSON.stringify(error))
    }
});

router.delete('/', async (req, res) => {
    const { messageId } = req.query;
    try {
        const deletedChat = await Chat.findByIdAndDelete(messageId);
        if (!deletedChat) {
            return res.status(403).json({ error: 'Chat not found' });
        }
        res.status(200).json(deletedChat);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete message' });
    }
});

module.exports = router;
