interface Props {
  message?: string
  onAction?: () => void
}

export default function EmptyState({
  message = 'No emails yet.',
  onAction,
}: Props) {
  return (
    <div className="empty">
      <p>📭</p>
      <p style={{ marginTop: 8 }}>{message}</p>
      {onAction && (
        <button
          className="btn-primary"
          style={{ marginTop: 12 }}
          onClick={onAction}
        >
          + Schedule Email
        </button>
      )}
    </div>
  )
}