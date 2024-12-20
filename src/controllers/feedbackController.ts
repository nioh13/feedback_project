import { Request, Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export async function createFeedback(req: AuthRequest, res: Response) {
  try {
    const { title, description, categoryId, statusId } = req.body;
    if(!title || !description || !categoryId || !statusId) {
      return res.status(400).json({ message: 'Не все необходимые поля заполнены' });
    }

    const userId = req.user?.userId;
    if(!userId) return res.status(401).json({ message: 'Не авторизован' });

    const feedback = await prisma.feedback.create({
      data: {
        title,
        description,
        categoryId: Number(categoryId),
        statusId: Number(statusId),
        authorId: userId
      }
    });

    return res.status(201).json(feedback);
  } catch(error) {
    console.error(error);
    return res.status(500).json({ message: 'Ошибка при создании предложения' });
  }
}

export async function getFeedbacks(req: Request, res: Response) {
  try {
    const { category, status, sort, page, limit } = req.query as {
      category?: string, status?: string, sort?: string, page?: string, limit?: string
    };

    const filters: any = {};
    if (category) filters.category = { name: category };
    if (status) filters.status = { name: status };

    let orderBy: any = { createdAt: 'desc' };

    if (sort === 'upvotes') {
      orderBy = {
        upvotes: { _count: 'desc' }
      };
    } else if (sort === 'date') {
      orderBy = { createdAt: 'desc' };
    }

    const pageNumber = page ? parseInt(page, 10) : 1;
    const pageSize = limit ? parseInt(limit, 10) : 10;
    const skip = (pageNumber - 1) * pageSize;

    const [data, total] = await Promise.all([
      prisma.feedback.findMany({
        where: filters,
        include: {
          category: true,
          status: true,
          _count: {
            select: { upvotes: true }
          }
        },
        orderBy,
        skip,
        take: pageSize
      }),
      prisma.feedback.count({ where: filters })
    ]);

    return res.json({
      data,
      pagination: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch(error) {
    console.error(error);
    return res.status(500).json({ message: 'Ошибка при получении предложений' });
  }
}

export async function getFeedbackById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const feedback = await prisma.feedback.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
        status: true,
        _count: {
          select: { upvotes: true }
        }
      }
    });
    if(!feedback) return res.status(404).json({ message: 'Предложение не найдено' });
    return res.json(feedback);
  } catch(error) {
    console.error(error);
    return res.status(500).json({ message: 'Ошибка при получении предложения' });
  }
}

export async function updateFeedback(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { title, description, categoryId, statusId } = req.body;

    const userId = req.user?.userId;
    if(!userId) return res.status(401).json({ message: 'Не авторизован' });

    const feedback = await prisma.feedback.findUnique({ where: { id: Number(id) } });
    if(!feedback) return res.status(404).json({ message: 'Предложение не найдено' });

    if(feedback.authorId !== userId) {
      return res.status(403).json({ message: 'Вы не можете редактировать это предложение' });
    }

    const updatedFeedback = await prisma.feedback.update({
      where: { id: Number(id) },
      data: {
        title: title ?? feedback.title,
        description: description ?? feedback.description,
        categoryId: categoryId ? Number(categoryId) : feedback.categoryId,
        statusId: statusId ? Number(statusId) : feedback.statusId
      }
    });

    return res.json(updatedFeedback);
  } catch(error) {
    console.error(error);
    return res.status(500).json({ message: 'Ошибка при обновлении предложения' });
  }
}

export async function deleteFeedback(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const userId = req.user?.userId;
    if(!userId) return res.status(401).json({ message: 'Не авторизован' });

    const feedback = await prisma.feedback.findUnique({ where: { id: Number(id) } });
    if(!feedback) return res.status(404).json({ message: 'Предложение не найдено' });

    if(feedback.authorId !== userId) {
      return res.status(403).json({ message: 'Вы не можете удалить это предложение' });
    }

    await prisma.feedback.delete({ where: { id: Number(id) } });
    return res.json({ message: 'Предложение удалено' });
  } catch(error) {
    console.error(error);
    return res.status(500).json({ message: 'Ошибка при удалении предложения' });
  }
}
