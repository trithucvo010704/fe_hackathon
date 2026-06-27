import { AlertTriangle, ArrowRight, Download, Eye, Paperclip, RefreshCw, Save, Send } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { HoldsPanel, OrderTabs } from '../components/order-components';
import { Badge, Button, ButtonLink, cx, MetricCard, PageHeader, Panel } from '../components/ui';
import { orderflowApi, type AgentInterpretResponseDto } from '../lib/orderflow-api';
import { formatCompactMoney, indexById, mapHoldView, mapLineView, orderCode } from '../lib/orderflow-view';
import { useLoadable } from '../lib/use-loadable';

type ChatMessage = {
  who: string;
  text: string;
  user?: boolean;
};

function ChatBubble({ who, text, user }: { who: string; text: string; user?: boolean }) {
  return (
    <div className={cx('flex', user ? 'justify-end' : 'justify-start')}>
      <div className={cx('max-w-[620px] rounded-lg px-4 py-3 text-sm leading-6', user ? 'bg-blue-600 text-white' : 'border border-slate-200 bg-white text-slate-800')}>
        <p className={cx('mb-1 text-xs font-bold', user ? 'text-blue-100' : 'text-slate-500')}>{who}</p>
        <p className="whitespace-pre-line">{text}</p>
      </div>
    </div>
  );
}

function summarizeAgentResponse(response: AgentInterpretResponseDto) {
  const extraction = response.extraction;
  const lines = extraction?.lines ?? [];
  const missing = extraction?.missingInformation ?? [];
  const lineSummary = lines
    .slice(0, 5)
    .map((line, index) => {
      const name = line.itemDescription || line.rawLineText || 'Dòng hàng chưa rõ';
      const quantity = line.quantity ? `${line.quantity} ${line.requestedUnit ?? ''}`.trim() : 'chưa rõ SL';
      return `${index + 1}. ${name} (${quantity})`;
    })
    .join('\n');

  const parts = [response.answer];
  if (lineSummary) parts.push(`Dòng AI bóc được:\n${lineSummary}`);
  if (missing.length) parts.push(`Cần bổ sung: ${missing.join(', ')}`);
  if (response.suggestedActions?.length) parts.push(`Gợi ý bước tiếp: ${response.suggestedActions[0]}`);
  if (response.guardrails?.length) parts.push(`Guardrail: ${response.guardrails[0]}`);

  return parts.filter(Boolean).join('\n\n');
}

export function SalesAiChatPage() {
  const { orderId } = useParams();
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [agentBusy, setAgentBusy] = useState(false);
  const [agentError, setAgentError] = useState<string | null>(null);
  const chatState = useLoadable(async () => {
    if (!orderId) throw new Error('Missing order id');
    const [detail, skus] = await Promise.all([
      orderflowApi.draftOrder(orderId),
      orderflowApi.productSkus(),
    ]);
    return { detail, skusById: indexById(skus) };
  }, [orderId]);

  const detail = chatState.data?.detail ?? null;
  const order = detail?.order ?? null;
  const lines = detail?.lines.map((line) => mapLineView(line, chatState.data?.skusById)) ?? [];
  const holds = (detail?.holds ?? []).filter((hold) => hold.status === 'OPEN').map((hold) => mapHoldView(hold, order));
  const defaultMessages: ChatMessage[] = [
    { who: 'AI', text: `I loaded ${orderCode(order)}. There are ${holds.length} open holds and ${lines.length} lines.` },
    { who: 'Sales', text: 'Which item should I review first?', user: true },
    { who: 'AI', text: holds.length ? `Start with ${holds[0].type}: ${holds[0].message}` : 'No blocking hold is open. You can review matched lines and approve if policy allows.' },
  ];
  const visibleMessages = messages.length ? messages : defaultMessages;

  async function askAgent(message = prompt.trim()) {
    if (!message || agentBusy) return;

    setMessages((current) => [...current, { who: 'Sales', text: message, user: true }]);
    setPrompt('');
    setAgentError(null);
    setAgentBusy(true);

    try {
      const response = await orderflowApi.agentInterpret({
        organization_code: 'ORDERFLOW_DEMO',
        draft_order_id: orderId,
        message,
        context: {
          mode: 'MVP_INTERNAL_AGENT',
          allow_auto_send_customer: false,
          allow_auto_approve: false,
          order_no: orderCode(order),
        },
      });
      setMessages((current) => [...current, { who: 'AI', text: summarizeAgentResponse(response) }]);
    } catch (error) {
      const messageText = error instanceof Error ? error.message : 'Agent API request failed';
      setAgentError(messageText);
      setMessages((current) => [...current, { who: 'AI', text: `Không gọi được Agent API: ${messageText}` }]);
    } finally {
      setAgentBusy(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void askAgent();
  }

  return (
    <>
      <PageHeader
        breadcrumb={`Draft orders / ${orderCode(order)} / AI Chat`}
        title={`Sales AI Chat - ${orderCode(order)}`}
        meta={chatState.error ? `Using demo fallback: ${chatState.error}` : 'Order context is loaded from draft-order detail.'}
        badges={[{ label: order?.status ?? 'DEMO', tone: holds.length ? 'red' : 'green' }, { label: `${holds.length} open holds`, tone: holds.length ? 'amber' : 'green' }]}
        actions={<><ButtonLink to={`/orders/${orderId ?? 'OF-1025'}/review`} variant="primary"><Eye size={16} /> Review</ButtonLink><Button><RefreshCw size={16} /> Run checks</Button><Button><Save size={16} /> Save note</Button><Button disabled={holds.length > 0}><Download size={16} /> Export quote</Button></>}
      />
      <OrderTabs orderId={orderId} />
      <div className="grid min-h-[720px] grid-cols-[300px_minmax(520px,1fr)_320px] gap-5">
        <Panel title="Order context" className="self-start">
          <div className="space-y-5">
            <div>
              <p className="font-bold">{orderCode(order)}</p>
              <p className="mt-1 text-sm text-slate-500">{order?.status ?? 'Demo'} - Customer {order?.customerId ?? '-'}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <MetricCard label="Total" value={formatCompactMoney(order?.totalAmount)} tone="slate" />
              <MetricCard label="Hold" value={String(holds.length)} tone={holds.length ? 'red' : 'green'} />
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6">{detail?.rawOrderText?.rawText ?? 'No raw text loaded.'}</div>
            <div className="space-y-2">
              {lines.map((line) => (
                <div key={line.id} className="rounded-lg border border-slate-200 p-3">
                  <p className="text-sm font-semibold">{line.sku}</p>
                  <p className="text-xs text-slate-500">{line.qty} - {line.status}</p>
                </div>
              ))}
            </div>
          </div>
        </Panel>
        <Panel title="Chat with AI" action={<Badge tone="green">{agentBusy ? 'Calling API' : 'Live Agent API'}</Badge>}>
          <p className="mb-4 text-sm text-slate-500">AI can explain and suggest via /api/agent/interpret. It must not approve orders, release holds, or override business rules.</p>
          {agentError && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{agentError}</div>}
          <div className="space-y-4">
            {visibleMessages.map((message, index) => (
              <ChatBubble key={`${message.who}-${index}`} who={message.who} text={message.text} user={message.user} />
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {['Explain open holds', 'Suggest SKU action', 'Draft customer reply', 'Create review checklist'].map((chip) => (
              <button
                key={chip}
                className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={agentBusy}
                onClick={() => void askAgent(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
          <form className="mt-5 flex items-end gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3" onSubmit={handleSubmit}>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white"><Paperclip size={18} /></button>
            <textarea
              className="min-h-12 flex-1 resize-none bg-transparent text-sm outline-none"
              placeholder="Ask AI about this order..."
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
            />
            <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={agentBusy || !prompt.trim()} type="submit"><Send size={18} /></button>
          </form>
        </Panel>
        <div className="space-y-5">
          <Panel title="Data & actions">
            <div className="grid grid-cols-3 gap-2">
              <MetricCard label="Lines" value={String(lines.length)} tone="blue" />
              <MetricCard label="Holds" value={String(holds.length)} tone={holds.length ? 'red' : 'green'} />
              <MetricCard label="Status" value={order?.status ?? '-'} tone="slate" />
            </div>
          </Panel>
          <HoldsPanel holds={holds} />
          <Panel title="Quick actions">
            <div className="space-y-2">
              {['Add note to order', 'Create review action', 'Open customer detail', 'Run checks after SKU selection'].map((item) => (
                <button key={item} className="flex w-full items-center justify-between rounded-lg border border-slate-200 p-3 text-left text-sm font-semibold hover:bg-slate-50">
                  {item}<ArrowRight size={15} />
                </button>
              ))}
            </div>
          </Panel>
          <Panel>
            <div className="flex gap-3 text-sm leading-6 text-amber-800">
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />
              AI suggestions are advisory. Backend rule checks and human review remain the source of approval.
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
