import { Bot } from 'lucide-react';
import { AiAssistantPanel, CheckList, DraftLinesTable, HoldsPanel, NextActions, OrderActions, OrderTabs, WorkflowPanel } from '../components/order-components';
import { Badge, ButtonLink, MetricCard, PageHeader, Panel } from '../components/ui';

export function OrderDetailPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Đơn nháp / OF-1025"
        title="OF-1025 - Đại lý Nam Phát"
        meta="Nguồn Zalo · Tạo bởi Trần Bình · 27/06/2026 09:42 · Cập nhật 3 phút trước"
        badges={[{ label: 'ON_HOLD', tone: 'red' }, { label: 'Credit hold', tone: 'amber' }, { label: 'SKU cần xác nhận', tone: 'blue' }]}
        actions={<OrderActions />}
      />
      <OrderTabs />
      <div className="grid grid-cols-5 gap-4">
        <MetricCard label="Dòng hàng" value="3" tone="blue" />
        <MetricCard label="SKU matched" value="2/3" tone="amber" />
        <MetricCard label="Hold mở" value="2" tone="red" />
        <MetricCard label="Tổng tiền" value="42.5M" tone="slate" />
        <MetricCard label="AI xử lý" value="58s" tone="green" />
      </div>
      <div className="mt-5 grid grid-cols-[1fr_340px] gap-5">
        <div className="space-y-5">
          <Panel title="Dữ liệu thô">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6">
              Nam Phát lấy ống PPR Bình Minh phi 25 PN20 300 cây, co 90 phi 25 120 cái, keo dán 20 hộp. Giao Bình Tân, cần báo giá hôm nay.
            </div>
            <div className="mt-3 flex gap-2"><Badge tone="blue">Zalo</Badge><Badge>Tiếng Việt</Badge><Badge tone="green">Đã bóc tách</Badge></div>
          </Panel>
          <Panel title="Chi tiết dòng hàng"><DraftLinesTable /></Panel>
          <Panel title="Tóm tắt kiểm tra"><CheckList /></Panel>
          <NextActions />
        </div>
        <div className="space-y-5">
          <WorkflowPanel />
          <HoldsPanel />
          <AiAssistantPanel />
          <Panel title="Lối tắt">
            <ButtonLink to="/orders/OF-1025/ai-chat" variant="primary"><Bot size={16} /> Hỏi AI về đơn này</ButtonLink>
          </Panel>
        </div>
      </div>
    </>
  );
}
