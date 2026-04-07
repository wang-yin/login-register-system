import express from 'express';
import {
  register,
  login,
  getRememberedEmail,
  profile,
} from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/remembered-email', getRememberedEmail);
router.get('/profile', protect, profile);

export default router;
