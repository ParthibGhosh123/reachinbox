export interface Email {
  id: number;
  to: string;
  from: string;
  subject: string;
  body: string;
  status: 'scheduled' | 'sent' | 'failed';
  scheduledAt: string;
  createdAt: string;
}

export interface ScheduleEmailPayload {
  to: string;
  from: string;
  subject: string;
  body: string;
  scheduledAt: string;
}