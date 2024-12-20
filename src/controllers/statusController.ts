import { Request, Response } from 'express';
import prisma from '../prisma';

export async function getStatuses(req: Request, res: Response) {
  try {
    const statuses = await prisma.status.findMany({ orderBy: { id: 'asc' } });
    return res.json(statuses);
  } catch(error) {
    console.error(error);
    return res.status(500).json({ message: 'Ошибка при получении статусов' });
  }
}
