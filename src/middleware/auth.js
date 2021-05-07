const config = require('config');
const jwt = require('jsonwebtoken');
// const User = require('../models/User');

const authRequired = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: 'No authorization.' });
      // return res.status(401).json({ message: 'No jwt token.' });
    }
    const decodedToken = jwt.verify(token, config.get('jwtSecret')); // decodedToken = { id: user._id }

    // const user = await User.findById(decodedToken.id);

    // if (!user) {
    //   return res.status(401).json({ message: 'Ooops! Clear cookis and try again.' });
    // }

    req.appContext = { userId: decodedToken.id };
    next();
  } catch (e) {
    res.status(401).json({ message: e.message });
  }
};

module.exports = authRequired;
