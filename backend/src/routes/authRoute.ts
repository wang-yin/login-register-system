import express from 'express';
import {
  register,
  login,
  getRememberedEmail,
  profile,
  updatePassword,
} from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';
import passport from 'passport';
import { oauthSuccess } from '../controllers/oauth_controller';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/remembered-email', getRememberedEmail);
router.get('/profile', protect, profile);
router.patch('/update-password', protect, updatePassword);

// google 登入入口
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/api/auth/login-failed',
  }),
  oauthSuccess,
);

//登入失敗
router.get('/login-failed', (req, res) => {
  res.status(401).json({ message: 'OAuth 驗證失敗' });
});

export default router;
