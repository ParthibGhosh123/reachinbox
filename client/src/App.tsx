import { useEffect, useState } from 'react';
type Email = { id: string; to: string; subject: string; body: string; status: string; scheduledAt: string; previewUrl?: string };

export default function App() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | 'scheduled' | 'sent'>('all');
  const [form, setForm] = useState({ to: '', subject: '', body: '', scheduledAt: '' });

  const load = async () => {
    const url = search ? `http://localhost:4000/api/search?q=${search}` : `http://localhost:4000/api/emails${tab === 'all' ? '' : `?status=${tab}`}`;
    const res = await fetch(url);
    setEmails(await res.json());
  };
  useEffect(() => { load(); const i = setInterval(load, 3000); return () => clearInterval(i); }, [tab, search]);

  const schedule = async () => {
    await fetch('http://localhost:4000/api/emails', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm({ to: '', subject: '', body: '', scheduledAt: '' }); load();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold">ReachInbox - Email Scheduler</h1>
      <a href="http://localhost:4000/admin/queues" target="_blank" className="text-blue-600 underline">Live BullMQ Dashboard →</a>
      <div className="bg-white p-4 rounded mt-4 grid gap-2 max-w-xl">
        <input className="border p-2 rounded" placeholder="To" value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
        <textarea className="border p-2 rounded" placeholder="Body" value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} />
        <input className="border p-2 rounded" type="datetime-local" value={form.scheduledAt} onChange={e => setForm({ ...form, scheduledAt: e.target.value })} />
        <button onClick={schedule} className="bg-black text-white p-2 rounded">Schedule Email</button>
      </div>
      <div className="flex gap-2 mt-4">
        <input className="border p-2 rounded flex-1" placeholder="Search emails (Elasticsearch)..." value={search} onChange={e => setSearch(e.target.value)} />
        <button onClick={() => setTab('all')} className="bg-white border px-3 rounded">All</button>
        <button onClick={() => setTab('scheduled')} className="bg-white border px-3 rounded">Scheduled</button>
        <button onClick={() => setTab('sent')} className="bg-white border px-3 rounded">Sent</button>
      </div>
      <div className="grid gap-2 mt-4">
        {emails.map(e => (
          <div key={e.id} className="bg-white p-3 rounded flex justify-between">
            <div><p className="font-bold">{e.subject} <span className="text-xs bg-gray-200 px-2 rounded">{e.status}</span></p><p className="text-sm text-gray-500">{e.to} • {new Date(e.scheduledAt).toLocaleString()}</p></div>
            {e.previewUrl && <a href={e.previewUrl} target="_blank" className="text-blue-600 text-sm">View in Ethereal →</a>}
          </div>
        ))}
      </div>
    </div>
  );
}