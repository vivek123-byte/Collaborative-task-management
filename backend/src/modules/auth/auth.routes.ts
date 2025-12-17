import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middlewares/validationMiddleware';
import { RegisterDto, LoginDto, UpdateProfileDto } from './auth.dtos';
import { authenticate } from '../../middlewares/authMiddleware';

const router = Router();
const authController = new AuthController();

router.post('/register', validate(RegisterDto), authController.register);
router.post('/login', validate(LoginDto), authController.login);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.me);
router.patch('/me', authenticate, validate(UpdateProfileDto), authController.updateMe);

export default router;
