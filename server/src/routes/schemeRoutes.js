import express from 'express';
import { getSchemes, chatWithSchemeAI, applyForScheme } from '../controllers/schemeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getSchemes);
router.post('/chat', chatWithSchemeAI);
router.post('/apply', protect, applyForScheme);

export default router;
