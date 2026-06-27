import { Download } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { OrderTabs } from '../components/order-components';
import { Badge, Button, PageHeader, Panel } from '../components/ui';
import { events as fallbackEvents } from '../data/orderflow';
import { orderflowApi } from '../lib/orderflow-api';
import { mapEvents, orderCode } from '../lib/orderflow-view';
import { useLoadable } from '../lib/use-loadable';

export function EventsPage() {
  const { orderId } = useParams();
  const eventsState = useLoadable(async () => {
    if (!orderId) throw new Error('Missing order id');
    const [detail, processingEvents, reviewActions, auditEvents] = await Promise.all([
      orderflowApi.draftOrder(orderId),
      orderflowApi.processingEvents(orderId),
      orderflowApi.reviewActions(orderId),
      orderflowApi.auditEvents(orderId),
    ]);
    return {
      orderNo: orderCode(detail.order),
      events: mapEvents(processingEvents, reviewActions),
      auditCount: auditEvents.length,
    };
  }, [orderId]);

  const rows = eventsState.data?.events ?? fallbackEvents.map(([time, code, detail, actor]) => ({
    id: `${time}-${code}`,
    time,
    code,
    detail,
    actor,
  }));

  return (
    <>
      <PageHeader
        breadcrumb={`Draft orders / ${eventsState.data?.orderNo ?? orderId ?? '-'} / Events`}
        title={`Processing History - ${eventsState.data?.orderNo ?? orderId ?? '-'}`}
        meta={eventsState.error ? `Using demo fallback: ${eventsState.error}` : `${eventsState.data?.auditCount ?? 0} audit records also available.`}
        actions={<Button><Download size={16} /> Export log</Button>}
      />
      <OrderTabs orderId={orderId} />
      <Panel>
        <div className="space-y-4">
          {rows.map((event) => (
            <div key={event.id} className="grid grid-cols-[90px_220px_1fr_120px] items-center gap-4 rounded-lg border border-slate-200 p-4">
              <p className="font-mono text-sm font-bold text-slate-700">{event.time}</p>
              <Badge tone={event.actor === 'rules' ? 'amber' : event.actor === 'ai' ? 'blue' : 'slate'}>{event.code}</Badge>
              <p className="text-sm text-slate-700">{event.detail}</p>
              <p className="text-right text-sm font-semibold text-slate-500">{event.actor}</p>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}
