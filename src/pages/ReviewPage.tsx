import { CheckCircle2, MessageSquare, Save } from 'lucide-react';
import { CheckList, DraftLinesTable, OrderTabs } from '../components/order-components';
import { Badge, Button, ButtonLink, Field, PageHeader, Panel } from '../components/ui';

export function ReviewPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Đơn nháp / OF-1025 / Review"
        title="Review Workbench - OF-1025"
        meta="Xác nhận SKU, giá, tồn kho và credit trước khi approve."
        badges={[{ label: '2 holds open', tone: 'amber' }, { label: 'Human review', tone: 'blue' }]}
        actions={<><ButtonLink to="/orders/OF-1025/ai-chat"><MessageSquare size={16} /> Mở AI Chat</ButtonLink><Button variant="primary"><Save size={16} /> Lưu review</Button></>}
      />
      <OrderTabs />
      <div className="grid grid-cols-[1fr_360px] gap-5">
        <div className="space-y-5">
          <Panel title="Dòng hàng cần review">
            <DraftLinesTable />
          </Panel>
          <Panel title="Ứng viên SKU cho dòng keo dán">
            <div className="grid grid-cols-2 gap-4">
              {[
                ['GLUE-PPR-BM-500', 'Keo dán PPR Bình Minh 500g', '82%', 'Đề xuất'],
                ['GLUE-PPR-STD-250', 'Keo dán PPR tiêu chuẩn 250g', '61%', 'Thay thế'],
              ].map(([sku, name, confidence, label]) => (
                <div key={sku} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center justify-between"><p className="font-bold text-blue-700">{sku}</p><Badge tone={label === 'Đề xuất' ? 'green' : 'slate'}>{label}</Badge></div>
                  <p className="mt-2 text-sm text-slate-700">{name}</p>
                  <p className="mt-3 text-sm font-semibold">Độ tin cậy {confidence}</p>
                  <Button variant={label === 'Đề xuất' ? 'primary' : 'secondary'}><CheckCircle2 size={16} /> Chọn SKU</Button>
                </div>
              ))}
            </div>
          </Panel>
        </div>
        <div className="space-y-5">
          <Panel title="Kiểm tra rule"><CheckList /></Panel>
          <Panel title="Credit hold">
            <div className="space-y-3">
              <Field label="Hạn mức" value="200.000.000đ" />
              <Field label="Công nợ hiện tại" value="188.000.000đ" />
              <Field label="Đơn mới" value="42.500.000đ" />
              <Field label="Vượt hạn mức" value={<span className="text-red-700">30.500.000đ</span>} />
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
