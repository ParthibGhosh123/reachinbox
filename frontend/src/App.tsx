import { useEffect, useState } from 'react'
import EmailTable from './components/EmailTable'
import EmptyState from './components/EmptyState'
import type { Email } from './types/email'

export default function App() {
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)

  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [time, setTime] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    fetch('http://localhost:4000/api/emails')
      .then((res) => {
        if (!res.ok) throw new Error('Server off')
        return res.json()
      })
      .then((data) => {
        setEmails(data)
        setError('')
      })
      .catch(() => {
        setError('Backend cholche na. Backend terminal e npm run dev koro')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleSchedule = async () => {
    if (!to || !subject || !body || !time) {
      setError('Sob field lagbe')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('http://localhost:4000/api/emails/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          from: 'me@test.com',
          subject,
          body,
          scheduledAt: new Date(time).toISOString(),
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setShowModal(false)
      setTo('')
      setSubject('')
      setBody('')
      setTime('')
      setError('')
      load()
    } catch {
      setError('Schedule holo na, backend check koro')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>ReachInbox</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Schedule Email
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <div className="loader">Loading...</div>
      ) : emails.length === 0 ? (
        <EmptyState
          message="No emails yet. Schedule one!"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <EmailTable emails={emails} />
      )}

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Schedule Email</h3>
            <br />
            <label>
              To
              <input value={to} onChange={(e) => setTo(e.target.value)} />
            </label>
            <label>
              Subject
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </label>
            <label>
              Body
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </label>
            <label>
              Time
              <input
                type="datetime-local"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </label>
            <br />
            <button
              className="btn-primary"
              onClick={handleSchedule}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Schedule'}
            </button>{' '}
            <button
              className="btn-danger"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}