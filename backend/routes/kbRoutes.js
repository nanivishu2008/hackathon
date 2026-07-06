import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import multer from 'multer';
import { upload, search, getAll, remove } from '../controllers/kbController.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

const uploader = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

router.use(authMiddleware);

router.post('/upload', uploader.array('files', 5), upload);
router.get('/search', search);
router.get('/all', getAll);
router.delete('/:docId', remove);

export default router;
