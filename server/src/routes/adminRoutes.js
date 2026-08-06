import express from 'express';
import {
  createScheme,
  updateScheme,
  deleteScheme,
  getAdminAnalytics,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  broadcastNotification,
  getAllApplications,
  updateApplicationStatus,
} from '../controllers/adminController.js';
import { getAllFeedback, updateFeedbackStatus } from '../controllers/feedbackController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

// ─── Analytics ─────────────────────────────────────────────────────────────
router.get('/analytics', getAdminAnalytics);

// ─── Scheme Management ────────────────────────────────────────────────────
router.post('/schemes', createScheme);
router.put('/schemes/:id', updateScheme);
router.delete('/schemes/:id', deleteScheme);

// ─── User Management ──────────────────────────────────────────────────────
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// ─── Scheme Applications ──────────────────────────────────────────────────
router.get('/applications', getAllApplications);
router.patch('/applications/:id/status', updateApplicationStatus);

// ─── Broadcasts ───────────────────────────────────────────────────────────
router.post('/broadcast', broadcastNotification);

// ─── Feedback Management ──────────────────────────────────────────────────
router.get('/feedback', getAllFeedback);
router.patch('/feedback/:id', updateFeedbackStatus);

export default router;
