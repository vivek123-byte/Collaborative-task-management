import { Router } from 'express';
import { TaskController } from './tasks.controller';
import { validate } from '../../middlewares/validationMiddleware';
import { authenticate } from '../../middlewares/authMiddleware';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dtos';

const router = Router();
const controller = new TaskController();

router.use(authenticate);

router.post('/', validate(CreateTaskDto), controller.create);
router.get('/', controller.findAll);
router.get('/assigned/me', controller.findAssignedToMe);
router.get('/created/me', controller.findCreatedByMe);
router.get('/overdue/me', controller.findOverdue);
router.get('/:id', controller.findOne);
router.patch('/:id', validate(UpdateTaskDto), controller.update);
router.delete('/:id', controller.delete);

export default router;
