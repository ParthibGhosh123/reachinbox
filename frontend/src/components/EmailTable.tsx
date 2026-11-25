import type { Email } from '../types/email'

interface Props {
  emails: Email[]
}

export default function EmailTable({ emails }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th>To</th>
          <th>Subject</th>
          <th>Scheduled At</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {emails.map((email) => (
          <tr key={email.id}>
            <td>{email.to}</td>
            <td>{email.subject}</td>
            <td>{new Date(email.scheduledAt).toLocaleString()}</td>
            <td>
              <span
                className={
                  email.status === 'sent'
                    ? 'status-sent'
                    : 'status-scheduled'
                }
              >
                {email.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}