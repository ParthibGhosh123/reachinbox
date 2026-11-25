import { Router } from 'express';
import { esClient } from '../elastic';
import { db } from '../db';
import { emails } from '../db/schema';
import { or, like } from 'drizzle-orm';

const router = Router();

router.get('/', async (req, res) => {
  const q = (req.query.q as string) || '';
  if (!q) {
    const all = await db.select().from(emails).limit(50);
    return res.json(all);
  }
  try {
    const result = await esClient.search({
      index: 'emails',
      query: { multi_match: { query: q, fields: ['subject', 'body', 'to'] } }
    });
    const hits = result.hits.hits.map((h: any) => h._source);
    if (hits.length > 0) return res.json(hits);
    throw new Error('ES empty');
  } catch {
    // Fallback - ES na cholle MySQL theke khujbe
    const rows = await db.select().from(emails).where(
      or(like(emails.subject, `%${q}%`), like(emails.body, `%${q}%`), like(emails.to, `%${q}%`))
    ).limit(50);
    res.json(rows);
  }
});

export default router;