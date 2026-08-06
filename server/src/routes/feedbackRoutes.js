import express from 'express';
import { submitFeedback, getAllFeedback, updateFeedbackStatus } from '../controllers/feedbackController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: any farmer can submit feedback (optionally logged in)
router.post('/', submitFeedback);

// Admin only: view and manage feedback
router.get('/', protect, adminOnly, getAllFeedback);
router.patch('/:id', protect, adminOnly, updateFeedbackStatus);

export default router;
