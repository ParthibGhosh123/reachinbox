import { useState } from 'react'

interface Props {
  onClose: () => void
  onSuccess: () => void
}

export default function ScheduleModal({ onClose, onSuccess }: Props) {
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [time, setTime] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSchedule = async () => {
    if (!to || !subject || !body || !time) {
      setError('Sob field lagbe')
      return
    }

    setSaving(true)
    setError('')

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

      onSuccess()
      onClose()
    } catch {
      setError('Schedule holo na, backend check koro')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Schedule Email</h3>
        <br />

        {error && <p className="error">{error}</p>}

        <label>
          To
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="test@gmail.com"
          />
        </label>

        <label>
          Subject
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Hello"
          />
        </label>

        <label>
          Body
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Email body..."
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
        <button className="btn-danger" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  )
}