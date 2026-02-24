// The flow is: get token from header 
// → verify it → find that user in DB → attach to req.user 
// → call next() to let the request through. 
// Line 11 splits "Bearer eyJhbG..." to grab just the token part. 
// Line 27 is why controllers can just write req.user._id without another DB lookup.


import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const authorize = async (req, res, next) => {
  try {
    // Get token from Authorization header → "Bearer <token>"
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided. Please log in.' });
    }

    // Read JWT_SECRET directly from process.env at call time
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default authorize;