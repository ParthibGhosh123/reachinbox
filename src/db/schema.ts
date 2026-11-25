import { mysqlTable, varchar, text, timestamp, index } from 'drizzle-orm/mysql-core';

export const emails = mysqlTable('emails', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  to: varchar('to', { length: 255 }).notNull(),
  from: varchar('from', { length: 255 }).notNull().default('ReachInbox <test@reachinbox.com>'),
  subject: text('subject').notNull(),
  body: text('body').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('scheduled'),
  scheduledAt: timestamp('scheduled_at').notNull(),
  sentAt: timestamp('sent_at'),
  jobId: varchar('job_id', { length: 100 }).unique(),
  previewUrl: text('preview_url'),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
  statusIdx: index('status_idx').on(t.status),
  scheduledIdx: index('scheduled_idx').on(t.scheduledAt),
}));

export type Email = typeof emails.$inferSelect;