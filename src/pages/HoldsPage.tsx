import { Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HoldsPanel } from '../components/order-components';
import { Badge, Button, PageHeader, Panel } from '../components/ui';
import { orderflowApi } from '../lib/orderflow-api';
import { mapHoldView } from '../lib/orderflow-view';
import { useLoadable } from '../lib/use-loadable';

export function HoldsPage() {
  const holdsState = useLoadable(async () => {
    const orders = await orderflowApi.draftOrders();
    const details = await Promise.allSettled(orders.slice(0, 20).map((order) => orderflowApi.draftOrder(order.id)));
    return details.flatMap((result) => {
      if (result.status !== 'fulfilled') return [];
      return result.value.holds
        .filter((hold) => hold.status === 'OPEN')
        .map((hold) => mapHoldView(hold, result.value.order));
    });
  }, []);

  const holds = holdsState.data ?? undefined;
  const selected = holds?.[0];

  return (
    <>
      <PageHeader
        breadcrumb="Hold Queue"
        title="Hold Queue - OrderFlow AI"
        meta={holdsState.error ? `Using demo fallback: ${holdsState.error}` : 'Open holds collected from draft order detail DTOs.'}
        badges={[{ label: `${holds?.length ?? 0} open holds`, tone: (holds?.length ?? 0) ? 'amber' : 'green' }]}
        actions={<Button><Filter size={16} /> Filter</Button>}
      />
      <div className="grid grid-cols-[1fr_360px] gap-5">
        <Panel title="Open holds">
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Hold</th><th className="px-4 py-3">Severity</th><th className="px-4 py-3">Owner</th><th className="px-4 py-3">Age</th><th></th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(holds ?? []).map((hold) => (
                  <tr key={hold.id}>
                    <td className="px-4 py-3 font-bold text-blue-700"><Link to={`/orders/${hold.orderId}/review`}>{hold.orderCode}</Link></td>
                    <td className="px-4 py-3">{hold.type}</td>
                    <td className="px-4 py-3"><Badge tone={hold.severity === 'High' ? 'red' : 'amber'}>{hold.severity}</Badge></td>
                    <td className="px-4 py-3">{hold.owner}</td>
                    <td className="px-4 py-3">{hold.sla}</td>
                    <td className="px-4 py-3 text-right"><Link to={`/orders/${hold.orderId}`} className="text-sm font-semibold text-blue-700">Open</Link></td>
                  </tr>
                ))}
                {!holds?.length && (
                  <tr><td colSpan={6} className="px-4 py-6 text-center text-sm text-slate-500">No live holds found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel title="Selected hold">
          <HoldsPanel holds={selected ? [selected] : holds} />
        </Panel>
      </div>
    </>
  );
}
