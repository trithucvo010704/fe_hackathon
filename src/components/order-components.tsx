import { ArrowRight, Bot, CheckCircle2, Clock3, Download, Eye, MessageSquare, RefreshCw, XCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { draftLines, orderTabs, orders } from '../data/orderflow';
import { Badge, Button, ButtonLink, cx, Panel, statusTone } from './ui';

export function OrderTabs() {
  const location = useLocation();

  return (
    <div className="mb-5 flex gap-1 border-b border-slate-200">
      {orderTabs.map((tab) => (
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

export function OrderTable({ compact = false }: { compact?: boolean }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Mã đơn</th>
            <th className="px-4 py-3">Khách hàng</th>
            {!compact && <th className="px-4 py-3">Nguồn</th>}
            <th className="px-4 py-3">Giá trị</th>
            <th className="px-4 py-3">Trạng thái</th>
            {!compact && <th className="px-4 py-3">Hold</th>}
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-bold text-blue-700"><Link to={`/orders/${order.id}`}>{order.id}</Link></td>
              <td className="px-4 py-3">
                <p className="font-semibold text-slate-900">{order.customer}</p>
                <p className="text-xs text-slate-500">{order.createdAt} · {order.owner}</p>
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
                  Mở <ArrowRight size={14} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DraftLinesTable() {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Dòng</th>
            <th className="px-4 py-3">Nội dung gốc</th>
            <th className="px-4 py-3">SKU đề xuất</th>
            <th className="px-4 py-3">Số lượng</th>
            <th className="px-4 py-3">Đơn giá</th>
            <th className="px-4 py-3">Thành tiền</th>
            <th className="px-4 py-3">Trạng thái</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {draftLines.map((line) => (
            <tr key={line.row}>
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

export function CheckList() {
  return (
    <div className="space-y-3">
      {[
        ['SKU matching', '2/3 matched', 'amber'],
        ['Price check', 'OK for DEALER', 'green'],
        ['Inventory', '2/3 sẵn sàng', 'amber'],
        ['Credit', 'Failed, vượt 30.5M', 'red'],
      ].map(([label, value, tone]) => (
        <div key={label} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
          <span className="text-sm font-semibold">{label}</span>
          <Badge tone={tone as Parameters<typeof Badge>[0]['tone']}>{value}</Badge>
        </div>
      ))}
    </div>
  );
}

export function OrderActions() {
  return (
    <>
      <ButtonLink to="/orders/OF-1025/review" variant="primary"><Eye size={16} /> Mở Review</ButtonLink>
      <ButtonLink to="/orders/OF-1025/ai-chat"><MessageSquare size={16} /> Mở AI Chat</ButtonLink>
      <Button><RefreshCw size={16} /> Chạy kiểm tra lại</Button>
      <Button disabled><Download size={16} /> Xuất báo giá</Button>
      <Button variant="danger"><XCircle size={16} /> Từ chối</Button>
    </>
  );
}

export function WorkflowPanel() {
  const steps = ['Raw text received', 'AI extraction', 'SKU matching', 'Rule checks', 'Human review', 'Approved/Exported'];

  return (
    <Panel title="Tiến độ xử lý">
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step} className="flex gap-3">
            <div className={cx('mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold', index < 4 ? 'bg-emerald-100 text-emerald-700' : index === 4 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400')}>
              {index < 4 ? <CheckCircle2 size={14} /> : index + 1}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{step}</p>
              {index === 4 && <p className="text-xs text-amber-700">Current: On hold</p>}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function HoldsPanel() {
  return (
    <Panel title="Danh sách Hold">
      <div className="space-y-3">
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <Badge tone="red">CREDIT_LIMIT_EXCEEDED</Badge>
          <p className="mt-2 text-sm font-semibold">Vượt hạn mức 30.500.000đ</p>
          <p className="text-xs text-slate-500">Owner: Sales Admin</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <Badge tone="amber">SKU_AMBIGUOUS</Badge>
          <p className="mt-2 text-sm font-semibold">Keo dán chưa xác nhận SKU</p>
          <p className="text-xs text-slate-500">Owner: Sales</p>
        </div>
      </div>
    </Panel>
  );
}

export function NextActions() {
  return (
    <Panel title="Hành động tiếp theo">
      <div className="grid grid-cols-3 gap-3">
        {['Xác nhận SKU keo dán', 'Trao đổi về công nợ/tách đơn', 'Chạy kiểm tra lại'].map((item) => (
          <div key={item} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm font-semibold">
            <Clock3 size={16} className="text-amber-500" /> {item}
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function AiAssistantPanel() {
  return (
    <Panel title="AI Assistant">
      <p className="text-sm leading-6 text-slate-700">Đơn có thể xử lý sau khi xác nhận SKU keo dán và giải quyết credit hold. Không nên xuất báo giá khi chưa có approval.</p>
      <div className="mt-4 flex gap-2">
        <ButtonLink to="/orders/OF-1025/ai-chat" variant="primary"><Bot size={16} /> Hỏi AI</ButtonLink>
        <ButtonLink to="/orders/OF-1025/review">Đi tới Review</ButtonLink>
      </div>
    </Panel>
  );
}
