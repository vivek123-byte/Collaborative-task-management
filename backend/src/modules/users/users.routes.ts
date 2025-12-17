import { Router } from 'express';
import { UserController } from './users.controller';
import { authenticate } from '../../middlewares/authMiddleware';

const router = Router();
const userController = new UserController();

router.get('/', authenticate, userController.findAll);

export default router;
