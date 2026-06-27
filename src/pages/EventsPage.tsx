import { Download } from 'lucide-react';
import { events } from '../data/orderflow';
import { OrderTabs } from '../components/order-components';
import { Badge, Button, PageHeader, Panel } from '../components/ui';

export function EventsPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Đơn nháp / OF-1025 / Events"
        title="Lịch sử xử lý - OF-1025"
        meta="Audit trail cho raw text, AI extraction, rule checks và review actions."
        actions={<Button><Download size={16} /> Export log</Button>}
      />
      <OrderTabs />
      <Panel>
        <div className="space-y-4">
          {events.map(([time, code, detail, actor]) => (
            <div key={`${time}-${code}`} className="grid grid-cols-[90px_220px_1fr_120px] items-center gap-4 rounded-lg border border-slate-200 p-4">
              <p className="font-mono text-sm font-bold text-slate-700">{time}</p>
              <Badge tone={actor === 'rules' ? 'amber' : actor === 'ai' ? 'blue' : 'slate'}>{code}</Badge>
              <p className="text-sm text-slate-700">{detail}</p>
              <p className="text-right text-sm font-semibold text-slate-500">{actor}</p>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}
