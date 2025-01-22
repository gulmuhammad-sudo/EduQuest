const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'user'],
    default: 'user'
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'disabled', 'pending'],
    default: 'pending'
  } 
});

UserSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    return next();
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
