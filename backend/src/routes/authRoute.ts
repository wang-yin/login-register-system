import express from 'express';
import {
  register,
  login,
  getRememberedEmail,
  profile,
  updatePassword,
} from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/remembered-email', getRememberedEmail);
router.get('/profile', protect, profile);
router.patch('/update-password', protect, updatePassword);

export default router;
