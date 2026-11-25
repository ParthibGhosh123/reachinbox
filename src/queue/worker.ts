import { Worker, Job } from 'bullmq';
import { connection } from '../redis/connection';
import { db } from '../db';
import { emails } from '../db/schema';
import { eq } from 'drizzle-orm';
import { sendEmail } from '../services/mailer';
import { indexEmail } from '../services/search';
import dotenv from 'dotenv';
dotenv.config();

const CONCURRENCY = Number(process.env.WORKER_CONCURRENCY || 5);
const DELAY_MS = Number(process.env.EMAIL_DELAY_MS || 2000);

export const worker = new Worker('email-scheduler', async (job: Job) => {
  const { emailId, to, subject, body } = job.data;
  const existing = await db.select().from(emails).where(eq(emails.id, emailId)).limit(1);
  if (existing[0]?.status === 'sent') return { skipped: true };
  await new Promise(r => setTimeout(r, DELAY_MS));
  const { previewUrl } = await sendEmail(to, subject, body);
  await db.update(emails).set({ status: 'sent', sentAt: new Date(), previewUrl }).where(eq(emails.id, emailId));
  await indexEmail({ id: emailId, to, subject, body, status: 'sent' });
  return { previewUrl };
}, {
  connection,
  concurrency: CONCURRENCY,
  limiter: { max: Number(process.env.RATE_LIMIT_MAX || 10), duration: Number(process.env.RATE_LIMIT_DURATION || 10000) },
});
worker.on('completed', (job) => console.log(`✅ Job ${job.id} completed`));
worker.on('failed', (job, err) => console.log(`❌ Job ${job?.id} failed: ${err.message}`));
console.log(`Worker started | Concurrency: ${CONCURRENCY} | Delay: ${DELAY_MS}ms`);