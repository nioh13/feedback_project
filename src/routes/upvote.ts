import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { upvoteFeedback } from '../controllers/upvoteController';

const router = Router();

router.post('/:id/upvote', authMiddleware, upvoteFeedback);

export default router;
