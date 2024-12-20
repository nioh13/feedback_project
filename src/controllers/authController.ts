import { Request, Response } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middlewares/authMiddleware';

export async function register(req: Request, res: Response) {
  try {
    const { email, password, avatar } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email и пароль обязательны.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        avatar: avatar || null,
      },
      select: { id: true, email: true, avatar: true, createdAt: true }
    });

    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    return res.status(201).json({
      user: newUser,
      token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if(!email || !password) {
      return res.status(400).json({ message: 'Email и пароль обязательны.' });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if(!user) return res.status(404).json({ message: 'Пользователь не найден.' });

    const valid = await bcrypt.compare(password, user.password);
    if(!valid) return res.status(401).json({ message: 'Неверный пароль.' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    return res.json({
      user: { id: user.id, email: user.email, avatar: user.avatar, createdAt: user.createdAt },
      token
    });
  } catch(error) {
    console.error(error);
    return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}

export async function me(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if(!userId) return res.status(401).json({ message: 'Не авторизован' });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, avatar: true, createdAt: true, updatedAt: true }
    });

    if(!user) return res.status(404).json({ message: 'Пользователь не найден' });

    return res.json(user);
  } catch(error) {
    console.error(error);
    return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}
