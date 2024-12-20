import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth';
import categoryRoutes from './routes/category';
import statusRoutes from './routes/status';
import feedbackRoutes from './routes/feedback';
import upvoteRoutes from './routes/upvote';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/statuses', statusRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/feedback', upvoteRoutes); // эндпоинты голосования

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
