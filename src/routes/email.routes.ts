import { Router } from 'express';
import { db } from '../db';
import { emails } from '../db/schema';
import { emailQueue } from '../queue/emailQueue';
import { desc, eq } from 'drizzle-orm';

const router = Router();

router.post('/schedule', async (req, res) => {
  try {
    const { to, subject, body, scheduledAt } = req.body;
    if (!to || !subject || !body || !scheduledAt) {
      return res.status(400).json({ error: 'to, subject, body, scheduledAt lagbe' });
    }
    const scheduled = new Date(scheduledAt);
    const delay = scheduled.getTime() - Date.now();
    if (delay < 0) return res.status(400).json({ error: 'Past time e schedule hobe na' });

    const id = crypto.randomUUID();
    await db.insert(emails).values({
      id, to, subject, body,
      status: 'scheduled',
      scheduledAt: scheduled,
      from: 'ReachInbox <test@reachinbox.com>',
    });

    const job = await emailQueue.add('send-email', { id }, { delay, jobId: id });
    await db.update(emails).set({ jobId: job.id as string }).where(eq(emails.id, id));

    res.json({ id, status: 'scheduled', jobId: job.id });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/', async (_req, res) => {
  const all = await db.select().from(emails).orderBy(desc(emails.createdAt)).limit(50);
  res.json(all);
});

export default router;