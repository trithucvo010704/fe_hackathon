import { ArrowRight, Bot, CheckCircle2, Clock3, Download, Eye, MessageSquare, RefreshCw, XCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { draftLines, orders } from '../data/orderflow';
import type { CheckItemView, DraftLineView, HoldView, OrderListItem } from '../lib/orderflow-view';
import { Badge, Button, ButtonLink, cx, Panel, statusTone } from './ui';

function fallbackOrders(): OrderListItem[] {
  return orders.map((order) => ({ ...order, code: order.id }));
}

function fallbackLines(): DraftLineView[] {
  return draftLines.map((line) => ({
    id: String(line.row),
    row: line.row,
    original: line.original,
    sku: line.sku,
    qty: line.qty,
    price: line.price,
    amount: line.amount,
    status: line.status,
  }));
}

function fallbackChecks(): CheckItemView[] {
  return [
    { label: 'SKU matching', value: '2/3 matched', tone: 'amber' },
    { label: 'Price check', value: 'OK for DEALER', tone: 'green' },
    { label: 'Inventory', value: '2/3 ready', tone: 'amber' },
    { label: 'Credit', value: 'Failed, over limit', tone: 'red' },
  ];
}

function fallbackHolds(): HoldView[] {
  return [
    {
      id: 'credit',
      orderId: 'OF-1025',
      orderCode: 'OF-1025',
      type: 'CREDIT_LIMIT_EXCEEDED',
      severity: 'High',
      owner: 'Sales Admin',
      sla: '1h 12m',
      message: 'Over credit limit',
      status: 'OPEN',
    },
    {
      id: 'sku',
      orderId: 'OF-1025',
      orderCode: 'OF-1025',
      type: 'SKU_AMBIGUOUS',
      severity: 'Medium',
      owner: 'Sales',
      sla: '2h 05m',
      message: 'SKU needs confirmation',
      status: 'OPEN',
    },
  ];
}

export function OrderTabs({ orderId = 'OF-1025' }: { orderId?: string }) {
  const location = useLocation();
  const tabs = [
    { label: 'Overview', to: `/orders/${orderId}` },
    { label: 'Review', to: `/orders/${orderId}/review` },
    { label: 'AI Chat', to: `/orders/${orderId}/ai-chat` },
    { label: 'Preview', to: `/orders/${orderId}/preview` },
    { label: 'Events', to: `/orders/${orderId}/events` },
  ];

  return (
    <div className="mb-5 flex gap-1 border-b border-slate-200">
      {tabs.map((tab) => (
        <Link
          key={tab.to}
          to={tab.to}
          className={cx(
            'border-b-2 px-4 py-3 text-sm font-semibold transition',
            location.pathname === tab.to ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-900',
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}

export function OrderTable({ compact = false, items = fallbackOrders() }: { compact?: boolean; items?: OrderListItem[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Order</th>
            <th className="px-4 py-3">Customer</th>
            {!compact && <th className="px-4 py-3">Source</th>}
            <th className="px-4 py-3">Value</th>
            <th className="px-4 py-3">Status</th>
            {!compact && <th className="px-4 py-3">Hold</th>}
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((order) => (
            <tr key={order.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-bold text-blue-700"><Link to={`/orders/${order.id}`}>{order.code}</Link></td>
              <td className="px-4 py-3">
                <p className="font-semibold text-slate-900">{order.customer}</p>
                <p className="text-xs text-slate-500">{order.createdAt} - {order.owner}</p>
              </td>
              {!compact && <td className="px-4 py-3 text-slate-600">{order.source}</td>}
              <td className="px-4 py-3 font-semibold">{order.total}</td>
              <td className="px-4 py-3"><Badge tone={statusTone(order.status)}>{order.status}</Badge></td>
              {!compact && (
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {order.holds.length ? order.holds.map((hold) => <Badge key={hold} tone="amber">{hold}</Badge>) : <Badge tone="green">No hold</Badge>}
                  </div>
                </td>
              )}
              <td className="px-4 py-3 text-right">
                <Link to={`/orders/${order.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700">
                  Open <ArrowRight size={14} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DraftLinesTable({ lines = fallbackLines() }: { lines?: DraftLineView[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Line</th>
            <th className="px-4 py-3">Raw text</th>
            <th className="px-4 py-3">Selected SKU</th>
            <th className="px-4 py-3">Qty</th>
            <th className="px-4 py-3">Unit price</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {lines.map((line) => (
            <tr key={line.id}>
              <td className="px-4 py-3 font-bold">{line.row}</td>
              <td className="px-4 py-3">{line.original}</td>
              <td className="px-4 py-3 font-semibold text-slate-900">{line.sku}</td>
              <td className="px-4 py-3">{line.qty}</td>
              <td className="px-4 py-3">{line.price}</td>
              <td className="px-4 py-3 font-semibold">{line.amount}</td>
              <td className="px-4 py-3"><Badge tone={statusTone(line.status)}>{line.status}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CheckList({ items = fallbackChecks() }: { items?: CheckItemView[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
          <span className="text-sm font-semibold">{item.label}</span>
          <Badge tone={item.tone}>{item.value}</Badge>
        </div>
      ))}
    </div>
  );
}

export function OrderActions({
  orderId = 'OF-1025',
  canExport = false,
  onRunChecks,
  onReject,
}: {
  orderId?: string;
  canExport?: boolean;
  onRunChecks?: () => void;
  onReject?: () => void;
}) {
  return (
    <>
      <ButtonLink to={`/orders/${orderId}/review`} variant="primary"><Eye size={16} /> Open Review</ButtonLink>
      <ButtonLink to={`/orders/${orderId}/ai-chat`}><MessageSquare size={16} /> AI Chat</ButtonLink>
      <Button onClick={onRunChecks}><RefreshCw size={16} /> Run checks</Button>
      <Button disabled={!canExport}><Download size={16} /> Export quote</Button>
      <Button variant="danger" onClick={onReject}><XCircle size={16} /> Reject</Button>
    </>
  );
}

export function WorkflowPanel({ status = 'ON_HOLD' }: { status?: string }) {
  const steps = ['Raw text received', 'AI extraction', 'SKU matching', 'Rule checks', 'Human review', 'Approved/Exported'];
  const doneUntil = status === 'APPROVED' || status === 'EXPORTED' ? 6 : status === 'READY_FOR_REVIEW' ? 5 : status === 'EXTRACTING' ? 2 : 4;

  return (
    <Panel title="Processing flow">
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step} className="flex gap-3">
            <div className={cx('mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold', index < doneUntil ? 'bg-emerald-100 text-emerald-700' : index === doneUntil ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400')}>
              {index < doneUntil ? <CheckCircle2 size={14} /> : index + 1}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{step}</p>
              {index === doneUntil && <p className="text-xs text-amber-700">Current: {status}</p>}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function HoldsPanel({ holds = fallbackHolds() }: { holds?: HoldView[] }) {
  return (
    <Panel title="Hold list">
      <div className="space-y-3">
        {holds.length ? holds.map((hold) => (
          <div key={hold.id} className={cx('rounded-lg border p-3', hold.severity === 'High' ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50')}>
            <Badge tone={hold.severity === 'High' ? 'red' : 'amber'}>{hold.type}</Badge>
            <p className="mt-2 text-sm font-semibold">{hold.message}</p>
            <p className="text-xs text-slate-500">Owner: {hold.owner} - {hold.status}</p>
          </div>
        )) : <Badge tone="green">No open hold</Badge>}
      </div>
    </Panel>
  );
}

export function NextActions({ holds = fallbackHolds() }: { holds?: HoldView[] }) {
  const actions = holds.length
    ? holds.slice(0, 3).map((hold) => `Handle ${hold.type}`)
    : ['Approve order', 'Generate quote', 'Generate pick list'];

  return (
    <Panel title="Next actions">
      <div className="grid grid-cols-3 gap-3">
        {actions.map((item) => (
          <div key={item} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm font-semibold">
            <Clock3 size={16} className="text-amber-500" /> {item}
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function AiAssistantPanel({ orderId = 'OF-1025', hasOpenHold = true }: { orderId?: string; hasOpenHold?: boolean }) {
  return (
    <Panel title="AI Assistant">
      <p className="text-sm leading-6 text-slate-700">{hasOpenHold ? 'This order still has open holds. Resolve them before approval or export.' : 'No open holds detected. The order can move to approval or document generation.'}</p>
      <div className="mt-4 flex gap-2">
        <ButtonLink to={`/orders/${orderId}/ai-chat`} variant="primary"><Bot size={16} /> Ask AI</ButtonLink>
        <ButtonLink to={`/orders/${orderId}/review`}>Go to Review</ButtonLink>
      </div>
    </Panel>
  );
}
