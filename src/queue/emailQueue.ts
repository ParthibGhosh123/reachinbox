import { Queue } from 'bullmq';
import { connection } from '../redis/connection';
export const emailQueue = new Queue('email-scheduler', { connection });

export async function scheduleEmailJob(data: { emailId: string; to: string; subject: string; body: string }, scheduledAt: Date) {
  const delay = Math.max(new Date(scheduledAt).getTime() - Date.now(), 0);
  const job = await emailQueue.add('send-email', data, {
    delay,
    jobId: data.emailId,
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: false,
    removeOnFail: false,
  });
  return job;
}