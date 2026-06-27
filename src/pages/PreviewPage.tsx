import { Download, Eye } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckList, DraftLinesTable, OrderTabs } from '../components/order-components';
import { Button, ButtonLink, Field, PageHeader, Panel } from '../components/ui';
import { orderflowApi } from '../lib/orderflow-api';
import { formatDateTime, formatMoney, indexById, mapCheckItems, mapLineView, orderCode } from '../lib/orderflow-view';
import { useLoadable } from '../lib/use-loadable';

export function PreviewPage() {
  const { orderId } = useParams();
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const previewState = useLoadable(async () => {
    if (!orderId) throw new Error('Missing order id');
    const [detail, skus] = await Promise.all([
      orderflowApi.draftOrder(orderId),
      orderflowApi.productSkus(),
    ]);
    return { detail, skusById: indexById(skus) };
  }, [orderId, reloadKey]);

  const detail = previewState.data?.detail ?? null;
  const order = detail?.order ?? null;
  const quote = detail?.documents.find((document) => document.documentType === 'QUOTE') ?? detail?.documents[0];
  const openHolds = detail?.holds.filter((hold) => hold.status === 'OPEN') ?? [];
  const canGenerate = !!order && openHolds.length === 0;

  async function generateQuote() {
    if (!orderId) return;
    setError(null);
    try {
      await orderflowApi.generateQuote(orderId);
      setReloadKey((value) => value + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generate quote failed');
    }
  }

  return (
    <>
      <PageHeader
        breadcrumb={`Draft orders / ${orderCode(order)} / Preview`}
        title={`Document Preview - ${orderCode(order)}`}
        meta={previewState.error ? `Using demo fallback: ${previewState.error}` : 'Quote/pick-list HTML snapshots from backend.'}
        badges={[{ label: canGenerate ? 'Ready to generate' : 'Locked by holds', tone: canGenerate ? 'green' : 'amber' }]}
        actions={<><ButtonLink to={`/orders/${orderId ?? 'OF-1025'}/review`}><Eye size={16} /> Review</ButtonLink><Button disabled={!canGenerate} onClick={generateQuote}><Download size={16} /> Generate quote</Button></>}
      />
      <OrderTabs orderId={orderId} />
      <div className="grid grid-cols-[1fr_320px] gap-5">
        <Panel>
          {quote?.htmlSnapshot ? (
            <div className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-10 shadow-sm" dangerouslySetInnerHTML={{ __html: quote.htmlSnapshot }} />
          ) : (
            <div className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-10 shadow-sm">
              <div className="flex justify-between">
                <div>
                  <p className="text-2xl font-bold">QUOTE</p>
                  <p className="mt-1 text-sm text-slate-500">{orderCode(order)} - {formatDateTime(order?.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">OrderFlow AI</p>
                  <p className="text-sm text-slate-500">Preview before backend document generation</p>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
                <Field label="Customer ID" value={order?.customerId ?? '-'} />
                <Field label="Delivery note" value={order?.deliveryNote ?? '-'} />
              </div>
              <div className="mt-8"><DraftLinesTable lines={detail?.lines.map((line) => mapLineView(line, previewState.data?.skusById))} /></div>
              <div className="mt-8 flex justify-end">
                <div className="w-72 space-y-2 text-sm">
                  <div className="flex justify-between border-t border-slate-200 pt-2 text-lg"><span>Total</span><strong>{formatMoney(order?.totalAmount)}</strong></div>
                </div>
              </div>
            </div>
          )}
          {error && <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
        </Panel>
        <Panel title="Document status">
          <CheckList items={mapCheckItems(detail)} />
        </Panel>
      </div>
    </>
  );
}
