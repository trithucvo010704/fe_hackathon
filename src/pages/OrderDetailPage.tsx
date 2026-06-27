import { Bot } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AiAssistantPanel, CheckList, DraftLinesTable, HoldsPanel, NextActions, OrderActions, OrderTabs, WorkflowPanel } from '../components/order-components';
import { Badge, ButtonLink, MetricCard, PageHeader, Panel } from '../components/ui';
import { orderflowApi } from '../lib/orderflow-api';
import { formatCompactMoney, formatDateTime, indexById, mapCheckItems, mapHoldView, mapLineView, orderCode } from '../lib/orderflow-view';
import { useLoadable } from '../lib/use-loadable';

export function OrderDetailPage() {
  const { orderId } = useParams();
  const [reloadKey, setReloadKey] = useState(0);
  const detailState = useLoadable(async () => {
    if (!orderId) throw new Error('Missing order id');
    const [detail, customers, skus] = await Promise.all([
      orderflowApi.draftOrder(orderId),
      orderflowApi.customers(),
      orderflowApi.productSkus(),
    ]);
    return { detail, customersById: indexById(customers), skusById: indexById(skus) };
  }, [orderId, reloadKey]);

  const detail = detailState.data?.detail ?? null;
  const order = detail?.order ?? null;
  const customer = order ? detailState.data?.customersById.get(order.customerId) : undefined;
  const lines = detail?.lines.map((line) => mapLineView(line, detailState.data?.skusById));
  const openHolds = (detail?.holds ?? []).filter((hold) => hold.status === 'OPEN');
  const holds = openHolds.map((hold) => mapHoldView(hold, order));
  const matched = detail?.lines.filter((line) => line.selectedSkuId || ['MATCHED', 'APPROVED'].includes(line.status)).length ?? 0;

  async function runChecks() {
    if (!orderId) return;
    await orderflowApi.runChecks(orderId);
    setReloadKey((value) => value + 1);
  }

  async function rejectOrder() {
    if (!orderId) return;
    await orderflowApi.rejectOrder(orderId, 'Rejected from frontend');
    setReloadKey((value) => value + 1);
  }

  return (
    <>
      <PageHeader
        breadcrumb={`Draft orders / ${orderCode(order)}`}
        title={`${orderCode(order)} - ${customer?.name ?? 'Order detail'}`}
        meta={detailState.error ? `Using demo fallback: ${detailState.error}` : `${detail?.rawOrderText?.sourceChannel ?? 'MANUAL_TEXT'} - Created ${formatDateTime(order?.createdAt)}`}
        badges={[
          { label: order?.status ?? 'ON_HOLD', tone: openHolds.length ? 'red' : 'green' },
          ...openHolds.slice(0, 2).map((hold) => ({ label: hold.holdType, tone: 'amber' as const })),
        ]}
        actions={<OrderActions orderId={orderId} canExport={!openHolds.length && !!order} onRunChecks={runChecks} onReject={rejectOrder} />}
      />
      <OrderTabs orderId={orderId} />
      <div className="grid grid-cols-5 gap-4">
        <MetricCard label="Lines" value={String(detail?.lines.length ?? 0)} tone="blue" />
        <MetricCard label="SKU matched" value={detail ? `${matched}/${detail.lines.length}` : '-'} tone={matched === detail?.lines.length ? 'green' : 'amber'} />
        <MetricCard label="Open holds" value={String(openHolds.length)} tone={openHolds.length ? 'red' : 'green'} />
        <MetricCard label="Total" value={formatCompactMoney(order?.totalAmount)} tone="slate" />
        <MetricCard label="Status" value={order?.status ?? '-'} tone={openHolds.length ? 'amber' : 'green'} />
      </div>
      <div className="mt-5 grid grid-cols-[1fr_340px] gap-5">
        <div className="space-y-5">
          <Panel title="Raw data">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6">
              {detail?.rawOrderText?.rawText ?? 'No raw text loaded.'}
            </div>
            <div className="mt-3 flex gap-2"><Badge tone="blue">{detail?.rawOrderText?.sourceChannel ?? 'MANUAL_TEXT'}</Badge><Badge tone="green">{order?.status ?? 'Loaded'}</Badge></div>
          </Panel>
          <Panel title="Order lines"><DraftLinesTable lines={lines} /></Panel>
          <Panel title="Rule summary"><CheckList items={mapCheckItems(detail)} /></Panel>
          <NextActions holds={holds} />
        </div>
        <div className="space-y-5">
          <WorkflowPanel status={order?.status} />
          <HoldsPanel holds={holds} />
          <AiAssistantPanel orderId={orderId} hasOpenHold={openHolds.length > 0} />
          <Panel title="Shortcut">
            <ButtonLink to={`/orders/${orderId ?? 'OF-1025'}/ai-chat`} variant="primary"><Bot size={16} /> Ask AI about this order</ButtonLink>
          </Panel>
        </div>
      </div>
    </>
  );
}
