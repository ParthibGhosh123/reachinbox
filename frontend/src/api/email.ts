import { Email, ScheduleEmailPayload } from '../types/email';

const BASE = 'http://localhost:4000/api/emails';

export async function getEmails(): Promise<Email[]> {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error('Failed to fetch emails');
  return res.json();
}

export async function scheduleEmail(data: ScheduleEmailPayload): Promise<Email> {
  const res = await fetch(`${BASE}/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to schedule');
  return res.json();
}