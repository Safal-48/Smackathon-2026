import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'krishi_seva_smart_farming_jwt_secret_key_2026');

      const isDbConnected = mongoose.connection.readyState === 1;

      if (!isDbConnected) {
        // Fallback for mock environment if DB is offline
        req.user = {
          _id: decoded.id,
          fullName: decoded.role === 'admin' ? 'KrishiSeva Admin (Offline Mock)' : 'Safal Sharma (Offline Mock)',
          phone: decoded.role === 'admin' ? '9999999999' : '9876543210',
          role: decoded.role || 'farmer',
          state: 'Maharashtra',
          district: 'Nagpur',
          preferredLanguage: 'en',
          farmSizeAcres: 3.5,
        };
        return next();
      }

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        req.user = { _id: decoded.id, role: decoded.role || 'farmer', fullName: 'Demo Farmer' };
      }
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Admin role required' });
  }
};
