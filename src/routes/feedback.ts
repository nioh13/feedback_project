import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { createFeedback, getFeedbacks, getFeedbackById, updateFeedback, deleteFeedback } from '../controllers/feedbackController';

const router = Router();

router.get('/', getFeedbacks);
router.get('/:id', getFeedbackById);
router.post('/', authMiddleware, createFeedback);
router.put('/:id', authMiddleware, updateFeedback);
router.delete('/:id', authMiddleware, deleteFeedback);

export default router;
