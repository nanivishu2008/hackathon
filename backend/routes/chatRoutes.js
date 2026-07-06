import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  sendMessage,
  getHistory,
  getAllChats,
  createNewChat,
  removeChat,
} from '../controllers/chatController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/send-message', sendMessage);
router.get('/history/:chatId', getHistory);
router.get('/all', getAllChats);
router.post('/create', createNewChat);
router.delete('/:chatId', removeChat);

export default router;
