import { Client } from '@elastic/elasticsearch';
const client = new Client({ node: process.env.ELASTIC_URL, auth: { apiKey: process.env.ELASTIC_API_KEY! } });
const INDEX = 'emails';

export async function ensureIndex() {
  try {
    const exists = await client.indices.exists({ index: INDEX });
    if (!exists) {
      await client.indices.create({ index: INDEX, mappings: { properties: { to: { type: 'text' }, subject: { type: 'text' }, body: { type: 'text' }, status: { type: 'keyword' } } } });
    }
  } catch (e) { console.log('ES fail, PG fallback'); }
}
export async function indexEmail(email: any) {
  try { await client.index({ index: INDEX, id: email.id, document: email }); } catch (e) {}
}
export async function searchEmails(query: string) {
  try {
    const res = await client.search({ index: INDEX, query: { multi_match: { query, fields: ['to', 'subject', 'body'] } } });
    return res.hits.hits.map((h: any) => ({ id: h._id, ...h._source }));
  } catch (e) { return []; }
}