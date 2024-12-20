import { Request, Response } from 'express';
import prisma from '../prisma';

export async function getCategories(req: Request, res: Response) {
  try {
    const categories = await prisma.category.findMany({ orderBy: { id: 'asc' } });
    return res.json(categories);
  } catch(error) {
    console.error(error);
    return res.status(500).json({ message: 'Ошибка при получении категорий' });
  }
}
