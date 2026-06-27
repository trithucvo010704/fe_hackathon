import { CheckCircle2, Lock, LogOut, Mail, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';

export function LoginPage() {
  const navigate = useNavigate();

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
            <h1 className="mt-4 text-5xl font-bold leading-tight">Chuyển tin nhắn bán hàng thành đơn nháp có kiểm soát.</h1>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {['SKU matching', 'Rule checks', 'Human review'].map((item) => (
                <div key={item} className="rounded-lg border border-white/20 bg-white/10 p-4">
                  <CheckCircle2 size={18} />
                  <p className="mt-3 text-sm font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-blue-100">Professional Clarity design system · Desktop MVP</p>
        </div>
        <div className="flex items-center justify-center bg-white p-12">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-bold text-slate-950">Đăng nhập</h2>
            <p className="mt-2 text-sm text-slate-500">Sử dụng tài khoản nội bộ của công ty.</p>
            <div className="mt-8 space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Email</span>
                <span className="mt-2 flex h-11 items-center gap-3 rounded-lg border border-slate-200 px-3">
                  <Mail size={18} className="text-slate-400" />
                  <input className="w-full outline-none" defaultValue="minhanh@orderflow.ai" />
                </span>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Mật khẩu</span>
                <span className="mt-2 flex h-11 items-center gap-3 rounded-lg border border-slate-200 px-3">
                  <Lock size={18} className="text-slate-400" />
                  <input className="w-full outline-none" type="password" defaultValue="orderflow" />
                </span>
              </label>
              <Button variant="primary" onClick={() => navigate('/dashboard')}>
                <LogOut size={16} /> Vào Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
