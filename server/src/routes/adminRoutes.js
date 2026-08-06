import express from 'express';
import { createScheme, updateScheme, deleteScheme, getAdminAnalytics } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);

router.post('/schemes', createScheme);
router.put('/schemes/:id', updateScheme);
router.delete('/schemes/:id', deleteScheme);
router.get('/analytics', getAdminAnalytics);

export default router;
