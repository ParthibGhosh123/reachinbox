interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}

export default function Input({ label, value, onChange, type = 'text' }: Props) {
  return (
    <label>
      {label}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} />
    </label>
  );
}