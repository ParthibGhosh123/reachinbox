import { useState } from 'react';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (email === 'admin@test.com' && password === '123456') {
      localStorage.setItem('loggedIn', 'true');
      onLogin();
    } else {
      setError('Wrong email or password!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm grid gap-3">
        <h1 className="text-2xl font-bold text-center">ReachInbox Login</h1>
        <p className="text-sm text-gray-500 text-center">Login to continue</p>
        <input className="border p-2 rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="border p-2 rounded" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button onClick={handleLogin} className="bg-black text-white p-2 rounded">Login</button>
        <p className="text-xs text-gray-400 text-center">Demo: admin@test.com / 123456</p>
      </div>
    </div>
  );
}