import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import emailRoutes from './routes/email.routes';
import searchRoutes from './routes/search.routes';
import { setupBullBoard } from './board/bullBoard';
import { recoverScheduledEmails } from './services/recovery';
import './queue/worker';

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.get('/dashboard', (_req, res) => res.sendFile(path.join(__dirname, 'dashboard.html')));
app.use('/api/emails', emailRoutes);
app.use('/api/emails/search', searchRoutes);
app.use('/admin/queues', setupBullBoard());

const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  console.log(`API running on ${PORT}`);
  await recoverScheduledEmails();
});