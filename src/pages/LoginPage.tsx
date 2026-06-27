import { CheckCircle2, Lock, LogIn, Mail, Sparkles } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import { orderflowApi, setSession } from '../lib/orderflow-api';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('sale.admin@orderflow.local');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const login = await orderflowApi.login({ email, password });
      setSession(login);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen grid-cols-[1fr_520px]">
        <div className="flex flex-col justify-between bg-blue-700 p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/15">
              <Sparkles size={22} />
            </div>
            <div>
              <p className="text-lg font-bold">OrderFlow AI</p>
              <p className="text-sm text-blue-100">AI order intake for sales teams</p>
            </div>
          </div>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">MVP workspace</p>
            <h1 className="mt-4 text-5xl font-bold leading-tight">Turn messy sales text into reviewed draft orders.</h1>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {['SKU matching', 'Rule checks', 'Human review'].map((item) => (
                <div key={item} className="rounded-lg border border-white/20 bg-white/10 p-4">
                  <CheckCircle2 size={18} />
                  <p className="mt-3 text-sm font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-blue-100">Backend contract: /api/** + BaseResponse.data</p>
        </div>
        <div className="flex items-center justify-center bg-white p-12">
          <form onSubmit={handleSubmit} className="w-full max-w-sm">
            <h2 className="text-2xl font-bold text-slate-950">Sign in</h2>
            <p className="mt-2 text-sm text-slate-500">Use the OrderFlow demo account seeded in backend.</p>
            <div className="mt-8 space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Email</span>
                <span className="mt-2 flex h-11 items-center gap-3 rounded-lg border border-slate-200 px-3">
                  <Mail size={18} className="text-slate-400" />
                  <input className="w-full outline-none" value={email} onChange={(event) => setEmail(event.target.value)} />
                </span>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Password</span>
                <span className="mt-2 flex h-11 items-center gap-3 rounded-lg border border-slate-200 px-3">
                  <Lock size={18} className="text-slate-400" />
                  <input className="w-full outline-none" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                </span>
              </label>
              {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
              <Button type="submit" variant="primary" disabled={loading}>
                <LogIn size={16} /> {loading ? 'Signing in...' : 'Go to Dashboard'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
