import app from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (err) {
      console.error('Database connection failed in serverless handler:', err);
    }
  }

  // Ensure req.url starts with /api for Express routing
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }

  return app(req, res);
}
