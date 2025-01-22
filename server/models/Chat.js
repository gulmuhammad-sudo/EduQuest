const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  message: {
    type: String,
    required: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  attachmentUrl: {
    type: String,
    required: false,
  },
}, { timestamps: true });

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;
