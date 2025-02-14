var express = require('express');
var router = express.Router();
var passport = require('passport');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.get('/user', async (req, res) => {
  const user = req.user;
  res.status(200).json({ user });
})

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  let errors = [];

  if (!email || !password) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.status(400).json(errors);
  } else {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email is already registered' });
    }

    const newUser = new User({
      name,
      email,
      password,
      role: 'user',
    });

    try {
      await newUser.save();
      res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
      res.status(500).json({ msg: 'Error registering user' });
    }
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) throw err;
    if (!user) return res.status(400).json({ msg: info.message });
    req.logIn(user, err => {
      if (err) throw err;
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '12h' });
      res.status(200).json({ msg: 'Logged in successfully', user, token });
    });
  })(req, res, next);
});


router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    res.status(200).json({ msg: 'Logged out successfully' });
  });
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find({role: "user"});
    res.status(200).json({ users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.post('/approve', async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.status = "active";
    await user.save();
    res.status(200).json({ message: 'User approved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve user' });
  }
})

router.post('/reject', async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.status = "disabled";
    await user.save();
    res.status(200).json({ message: 'User rejected successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve user' });
  }
})


module.exports = router;
