import { CheckCircle2, MessageSquare, Save } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckList, DraftLinesTable, HoldsPanel, OrderTabs } from '../components/order-components';
import { Badge, Button, ButtonLink, Field, PageHeader, Panel } from '../components/ui';
import { orderflowApi } from '../lib/orderflow-api';
import { candidateSku, formatMoney, indexById, mapCheckItems, mapHoldView, mapLineView, orderCode } from '../lib/orderflow-view';
import { useLoadable } from '../lib/use-loadable';

export function ReviewPage() {
  const { orderId } = useParams();
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const reviewState = useLoadable(async () => {
    if (!orderId) throw new Error('Missing order id');
    const [detail, skus] = await Promise.all([
      orderflowApi.draftOrder(orderId),
      orderflowApi.productSkus(),
    ]);
    return { detail, skusById: indexById(skus) };
  }, [orderId, reloadKey]);

  const detail = reviewState.data?.detail ?? null;
  const order = detail?.order ?? null;
  const lines = detail?.lines.map((line) => mapLineView(line, reviewState.data?.skusById));
  const reviewLine = detail?.lines.find((line) => !line.selectedSkuId || ['PENDING_MATCH', 'NEEDS_CLARIFICATION'].includes(line.status)) ?? detail?.lines[0];
  const candidates = reviewLine ? (detail?.candidatesByLineId?.[reviewLine.id] ?? []) : [];
  const openHolds = (detail?.holds ?? []).filter((hold) => hold.status === 'OPEN');
  const holds = openHolds.map((hold) => mapHoldView(hold, order));
  const credit = detail?.creditChecks?.[0];

  async function selectSku(lineId: string, skuId: string) {
    setError(null);
    try {
      await orderflowApi.selectSku(lineId, skuId);
      if (orderId) await orderflowApi.runChecks(orderId);
      setReloadKey((value) => value + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Select SKU failed');
    }
  }

  async function saveReview() {
    if (!orderId) return;
    setError(null);
    try {
      await orderflowApi.runChecks(orderId);
      setReloadKey((value) => value + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Run checks failed');
    }
  }

  return (
    <>
      <PageHeader
        breadcrumb={`Draft orders / ${orderCode(order)} / Review`}
        title={`Review Workbench - ${orderCode(order)}`}
        meta={reviewState.error ? `Using demo fallback: ${reviewState.error}` : 'Confirm SKU, price, inventory, and credit before approval.'}
        badges={[{ label: `${openHolds.length} open holds`, tone: openHolds.length ? 'amber' : 'green' }, { label: 'Human review', tone: 'blue' }]}
        actions={<><ButtonLink to={`/orders/${orderId ?? 'OF-1025'}/ai-chat`}><MessageSquare size={16} /> AI Chat</ButtonLink><Button variant="primary" onClick={saveReview}><Save size={16} /> Save review</Button></>}
      />
      <OrderTabs orderId={orderId} />
      <div className="grid grid-cols-[1fr_360px] gap-5">
        <div className="space-y-5">
          <Panel title="Lines needing review">
            <DraftLinesTable lines={lines} />
          </Panel>
          <Panel title={reviewLine ? `SKU candidates for line ${reviewLine.lineNo}` : 'SKU candidates'}>
            <div className="grid grid-cols-2 gap-4">
              {candidates.length ? candidates.map((candidate, index) => {
                const sku = candidateSku(candidate, reviewState.data?.skusById);
                return (
                  <div key={candidate.id} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex items-center justify-between"><p className="font-bold text-blue-700">{sku.code}</p><Badge tone={index === 0 ? 'green' : 'slate'}>{index === 0 ? 'Top match' : 'Alternative'}</Badge></div>
                    <p className="mt-2 text-sm text-slate-700">{sku.name}</p>
                    <p className="mt-3 text-sm font-semibold">Confidence {sku.confidence}</p>
                    <p className="mt-1 text-xs text-slate-500">{sku.reason}</p>
                    <div className="mt-4">
                      <Button variant={index === 0 ? 'primary' : 'secondary'} onClick={() => selectSku(candidate.draftOrderLineId, candidate.skuId)}><CheckCircle2 size={16} /> Select SKU</Button>
                    </div>
                  </div>
                );
              }) : <p className="text-sm text-slate-500">No candidate returned by backend yet.</p>}
            </div>
            {error && <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
          </Panel>
        </div>
        <div className="space-y-5">
          <Panel title="Rule checks"><CheckList items={mapCheckItems(detail)} /></Panel>
          <HoldsPanel holds={holds} />
          <Panel title="Credit snapshot">
            <div className="space-y-3">
              <Field label="Limit" value={formatMoney(credit?.creditLimit)} />
              <Field label="Current debt" value={formatMoney(credit?.currentDebt)} />
              <Field label="Order amount" value={formatMoney(credit?.orderAmount)} />
              <Field label="Projected debt" value={<span className={credit?.status === 'FAIL' ? 'text-red-700' : 'text-slate-900'}>{formatMoney(credit?.projectedDebt)}</span>} />
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
