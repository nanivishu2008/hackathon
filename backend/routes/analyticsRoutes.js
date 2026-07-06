import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getSummary, getDetailed } from '../controllers/analyticsController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/summary', getSummary);
router.get('/detailed', getDetailed);

export default router;
