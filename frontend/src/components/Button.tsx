interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  variant?: 'primary' | 'danger';
}

export default function Button({ children, onClick, loading, variant = 'primary' }: Props) {
  return (
    <button 
      onClick={onClick} 
      disabled={loading}
      className={variant === 'primary' ? 'btn-primary' : 'btn-danger'}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}