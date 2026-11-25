import { db } from '../db';
import { emails } from '../db/schema';
import { emailQueue } from '../queue/emailQueue';
import { eq, and, lte } from 'drizzle-orm';

export async function recoverScheduledEmails() {
  const pending = await db.select().from(emails).where(
    and(eq(emails.status, 'scheduled'), lte(emails.scheduledAt, new Date()))
  );
  console.log(`Recovering ${pending.length} scheduled emails...`);
  for (const e of pending) {
    await emailQueue.add('send-email', { id: e.id }, { jobId: e.id });
  }
}