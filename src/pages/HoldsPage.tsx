import { Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HoldsPanel } from '../components/order-components';
import { Badge, Button, PageHeader, Panel } from '../components/ui';

export function HoldsPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Hold Queue"
        title="Hold Queue - OrderFlow AI"
        meta="Danh sách đơn bị chặn bởi rule check, công nợ, tồn kho hoặc SKU chưa rõ."
        badges={[{ label: '9 open holds', tone: 'amber' }]}
        actions={<Button><Filter size={16} /> Bộ lọc</Button>}
      />
      <div className="grid grid-cols-[1fr_360px] gap-5">
        <Panel title="Danh sách hold">
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="px-4 py-3">Đơn</th><th className="px-4 py-3">Loại hold</th><th className="px-4 py-3">Severity</th><th className="px-4 py-3">Owner</th><th className="px-4 py-3">SLA</th><th></th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ['OF-1025', 'CREDIT_LIMIT_EXCEEDED', 'High', 'Sales Admin', '1h 12m'],
                  ['OF-1025', 'SKU_AMBIGUOUS', 'Medium', 'Sales', '2h 05m'],
                  ['OF-1023', 'INVENTORY_SHORTAGE', 'High', 'Ops', '45m'],
                ].map(([order, type, severity, owner, sla]) => (
                  <tr key={`${order}-${type}`}>
                    <td className="px-4 py-3 font-bold text-blue-700"><Link to={`/orders/${order}/review`}>{order}</Link></td>
                    <td className="px-4 py-3">{type}</td>
                    <td className="px-4 py-3"><Badge tone={severity === 'High' ? 'red' : 'amber'}>{severity}</Badge></td>
                    <td className="px-4 py-3">{owner}</td>
                    <td className="px-4 py-3">{sla}</td>
                    <td className="px-4 py-3 text-right"><Link to={`/orders/${order}`} className="text-sm font-semibold text-blue-700">Mở</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel title="Hold đang chọn">
          <HoldsPanel />
        </Panel>
      </div>
    </>
  );
}
