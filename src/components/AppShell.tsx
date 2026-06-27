import { Bell, ClipboardList, LayoutDashboard, Package, Search, ShieldAlert, Sparkles, UserCircle, Users } from 'lucide-react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { cx } from './ui';

export function AppShell() {
  const location = useLocation();
  const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, active: location.pathname.startsWith('/dashboard') },
    { label: 'Đơn nháp', to: '/orders', icon: ClipboardList, active: location.pathname.startsWith('/orders') },
    { label: 'Hold Queue', to: '/holds', icon: ShieldAlert, active: location.pathname.startsWith('/holds') },
    { label: 'Sản phẩm', to: '/products', icon: Package, active: location.pathname.startsWith('/products') },
    { label: 'Khách hàng', to: '/customers', icon: Users, active: location.pathname.startsWith('/customers') },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-20 flex w-[280px] flex-col border-r border-slate-200 bg-white">
        <Link to="/dashboard" className="flex h-16 items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-950">OrderFlow AI</p>
            <p className="text-xs text-slate-500">Sales operations</p>
          </div>
        </Link>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cx(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition',
                  item.active ? 'bg-blue-50 text-blue-700 shadow-[inset_3px_0_0_#3b82f6]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                )}
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="border-t border-slate-100 p-4">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-500">Công ty sử dụng</p>
            <p className="mt-1 text-sm font-bold text-slate-900">Bình Minh Trading</p>
          </div>
        </div>
      </aside>
      <div className="pl-[280px]">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
          <div className="relative w-[420px]">
            <Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={18} />
            <input className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-blue-400 focus:bg-white" placeholder="Tìm đơn, khách hàng, SKU..." />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600">
              <Bell size={18} />
            </button>
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
              <UserCircle size={20} className="text-blue-600" />
              <div>
                <p className="text-sm font-semibold leading-none">Minh Anh</p>
                <p className="mt-1 text-xs text-slate-500">Sales Admin</p>
              </div>
            </div>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
