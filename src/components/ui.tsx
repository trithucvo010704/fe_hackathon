import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { BadgeTone, MetricTone } from '../data/orderflow';

export const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

function badgeToneClasses(tone: BadgeTone) {
  const tones: Record<BadgeTone, string> = {
    blue: 'border-blue-200 bg-blue-50 text-blue-700',
    green: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-800',
    red: 'border-red-200 bg-red-50 text-red-700',
    slate: 'border-slate-200 bg-slate-100 text-slate-700',
    purple: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  };
  return tones[tone];
}

function metricToneClasses(tone: MetricTone) {
  const tones: Record<MetricTone, string> = {
    blue: 'border-blue-200 bg-blue-50 text-blue-700',
    green: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-800',
    red: 'border-red-200 bg-red-50 text-red-700',
    slate: 'border-slate-200 bg-white text-slate-700',
  };
  return tones[tone];
}

export function statusTone(status: string): BadgeTone {
  if (status.includes('APPROVED') || status.includes('READY') || status.includes('Matched')) return 'green';
  if (status.includes('HOLD') || status.includes('Needs') || status.includes('Watch')) return 'amber';
  if (status.includes('Failed') || status.includes('EXCEEDED')) return 'red';
  return 'blue';
}

export function Badge({ children, tone = 'slate' }: { children: React.ReactNode; tone?: BadgeTone }) {
  return (
    <span className={cx('inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold', badgeToneClasses(tone))}>
      {children}
    </span>
  );
}

export function ButtonLink({
  to,
  children,
  variant = 'secondary',
  disabled,
}: {
  to: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}) {
  const base = 'inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
    danger: 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
  };

  if (disabled) {
    return <span className={cx(base, 'cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400')}>{children}</span>;
  }

  return (
    <Link to={to} className={cx(base, variants[variant])}>
      {children}
    </Link>
  );
}

export function Button({
  children,
  variant = 'secondary',
  onClick,
  disabled,
  type = 'button',
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
    danger: 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cx(
        'inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition',
        disabled ? 'cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400' : variants[variant],
      )}
    >
      {children}
    </button>
  );
}

export function Panel({ title, action, children, className }: { title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cx('rounded-lg border border-slate-200 bg-white shadow-sm', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          {title && <h2 className="text-sm font-bold text-slate-900">{title}</h2>}
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function MetricCard({ label, value, hint, tone = 'slate' }: { label: string; value: string; hint?: string; tone?: MetricTone }) {
  return (
    <div className={cx('rounded-lg border p-4', metricToneClasses(tone))}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}

export function PageHeader({
  breadcrumb,
  title,
  meta,
  badges,
  actions,
}: {
  breadcrumb: string;
  title: string;
  meta?: string;
  badges?: Array<{ label: string; tone: BadgeTone }>;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
          {breadcrumb.split('/').map((item, index, list) => (
            <React.Fragment key={`${item}-${index}`}>
              <span>{item.trim()}</span>
              {index < list.length - 1 && <ChevronRight size={14} />}
            </React.Fragment>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">{title}</h1>
          {badges?.map((badge) => (
            <Badge key={badge.label} tone={badge.tone}>
              {badge.label}
            </Badge>
          ))}
        </div>
        {meta && <p className="mt-2 text-sm text-slate-500">{meta}</p>}
      </div>
      {actions && <div className="flex flex-wrap justify-end gap-2">{actions}</div>}
    </div>
  );
}
