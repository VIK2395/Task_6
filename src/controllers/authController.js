const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth_signup_post = async (req, res) => {
  try {
    const { email, password } = req.body;

    const candidate = await User.findOne({ email });

    if (candidate) {
      return res.status(400).json({ message: 'Such a user already exists.' });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ email, password: hashedPassword });

    await user.save();

    const token = jwt.sign({ id: user._id }, config.get('jwtSecret'), {
      expiresIn: '1h',
    });

    res.cookie('jwt', token, { httpOnly: true, maxAge: 60 * 60 * 1000 }); // 1h in milliseconds

    res.status(201).json({ userId: user._id, message: 'Signup successful.' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const auth_login_post = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Such a user not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Password is wrong.' });
    }

    const token = jwt.sign({ id: user._id }, config.get('jwtSecret'), {
      expiresIn: '1h',
    });

    res.cookie('jwt', token, { httpOnly: true, maxAge: 60 * 60 * 1000 }); // 1h in milliseconds

    res.status(201).json({ userId: user._id, message: 'Login successful.' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const auth_logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 0 });
  res.json({ message: 'Logout successful.' });
  // res.end();
};

// /auth/
const auth_get = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = {
  auth_signup_post,
  auth_login_post,
  auth_logout_get,
  auth_get,
};
