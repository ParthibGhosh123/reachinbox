import { Client } from '@elastic/elasticsearch';

// Elastic na cholleo server jate na more - tai try/catch
let client: Client | null = null;

try {
  if (process.env.ELASTIC_URL && process.env.ELASTIC_URL !== 'https://xxx.es.ap-south-1.aws.elastic.cloud:443') {
    client = new Client({
      node: process.env.ELASTIC_URL,
      auth: { apiKey: process.env.ELASTIC_API_KEY || '' },
      tls: { rejectUnauthorized: false }
    });
  }
} catch (e) {
  console.log('Elastic disabled, MySQL fallback cholbe');
  client = null;
}

export const elastic = client;

// Search function - Elastic thakle Elastic, na thakle null
export async function searchElastic(q: string) {
  if (!client) return null;
  try {
    const res = await client.search({
      index: 'emails',
      query: { multi_match: { query: q, fields: ['to', 'subject', 'body'] } }
    });
    return res.hits.hits.map((h: any) => h._source);
  } catch {
    return null; // Fail hole MySQL e jabe
  }
}

// Index function - Email save korar somoy
export async function indexEmail(email: any) {
  if (!client) return;
  try {
    await client.index({ index: 'emails', id: email.id, document: email });
  } catch {}
}