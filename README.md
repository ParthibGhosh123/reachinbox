# ReachInbox - Email Scheduling & Search System

Simple version of ReachInbox assignment. Schedule emails for future, process with BullMQ + Redis, store in MySQL, search with Elasticsearch (MySQL fallback).

## Features Implemented

### Backend
- ✅ Schedule email with future time (BullMQ delayed jobs, NO cron)
- ✅ Persistence on restart - Future emails still send, no duplicate send (Idempotency)
- ✅ Min delay 2 sec between sends (Provider throttling mimic)
- ✅ Rate Limiting: MAX_EMAILS_PER_HOUR=200 (configurable via .env)
- ✅ Redis backed counter keyed by `hour_window` - Safe for multi-worker
- ✅ On limit hit: Job NOT dropped, delayed to next hour window
- ✅ Slack Notification on Rate Limit Hit (via Slack Bot API)
- ✅ Elasticsearch search + MySQL fallback
- ✅ Bull Board Dashboard

### Frontend
- ✅ Google Login (Real OAuth)
- ✅ Main Dashboard - Header with Name, Email, Avatar, Logout
- ✅ Tabs: Scheduled Emails / Sent Emails
- ✅ Compose New Email Modal - Subject, Body, CSV Upload, Start Time, Delay, Hourly Limit
- ✅ CSV parse - Shows number of emails detected
- ✅ Loading + Empty states

## Tech Stack
- Backend: Node.js + Express + TypeScript + BullMQ + Redis (Upstash)
- DB: MySQL + Drizzle ORM
- Search: Elasticsearch
- Email: Nodemailer + Ethereal (Testing)
- Frontend: HTML / React + TypeScript + Tailwind
- Auth: Google OAuth + Slack OAuth

## How to Run - Backend

```bash
cd reachinbox-simple
npm install