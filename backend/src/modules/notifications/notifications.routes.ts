import { Router } from 'express';
import { authenticate } from '../../middlewares/authMiddleware';
import { NotificationController } from './notifications.controller';

const router = Router();
const controller = new NotificationController();

router.use(authenticate);

router.get('/', controller.list);
router.patch('/:id/read', controller.markRead);

export default router;
