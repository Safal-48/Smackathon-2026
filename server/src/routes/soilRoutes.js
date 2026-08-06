import express from 'express';
import { analyzeSoil, getSoilHistory } from '../controllers/soilController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/analyze', analyzeSoil);
router.get('/history', protect, getSoilHistory);

export default router;
