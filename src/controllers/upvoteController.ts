import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export async function upvoteFeedback(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params; // feedbackId
    const userId = req.user?.userId;
    if(!userId) return res.status(401).json({ message: 'Не авторизован' });

    const feedbackId = Number(id);

    const feedback = await prisma.feedback.findUnique({ where: { id: feedbackId } });
    if(!feedback) return res.status(404).json({ message: 'Предложение не найдено' });

    const existingVote = await prisma.upvote.findUnique({
      where: {
        userId_feedbackId: { userId, feedbackId }
      }
    });

    if (existingVote) {
      await prisma.upvote.delete({
        where: {
          userId_feedbackId: { userId, feedbackId }
        }
      });
      return res.json({ message: 'Голос удалён' });
    } else {
      await prisma.upvote.create({
        data: { userId, feedbackId }
      });
      return res.json({ message: 'Голос добавлен' });
    }
  } catch(error) {
    console.error(error);
    return res.status(500).json({ message: 'Ошибка при голосовании' });
  }
}
