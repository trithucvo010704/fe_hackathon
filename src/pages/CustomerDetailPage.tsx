import { Bot, CreditCard, Plus } from 'lucide-react';
import { HoldsPanel, OrderTable } from '../components/order-components';
import { Button, ButtonLink, Field, MetricCard, PageHeader, Panel } from '../components/ui';

export function CustomerDetailPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Khách hàng / KH-002"
        title="Đại lý Nam Phát"
        meta="MST 0312456789 · Sales owner Trần Bình · Cập nhật 10 phút trước"
        badges={[{ label: 'DEALER', tone: 'blue' }, { label: 'Đang hoạt động', tone: 'green' }, { label: 'Watch credit', tone: 'amber' }]}
        actions={<><ButtonLink to="/orders/new" variant="primary"><Plus size={16} /> Tạo đơn mới</ButtonLink><ButtonLink to="/orders/OF-1025/ai-chat"><Bot size={16} /> Mở AI Chat</ButtonLink><Button><CreditCard size={16} /> Kiểm tra công nợ</Button><ButtonLink to="/customers">Quay lại</ButtonLink></>}
      />
      <div className="grid grid-cols-5 gap-4">
        <MetricCard label="Hạn mức" value="200M" tone="blue" />
        <MetricCard label="Công nợ hiện tại" value="188M" tone="amber" />
        <MetricCard label="Quá hạn" value="0đ" tone="green" />
        <MetricCard label="Còn lại" value="12M" tone="amber" />
        <MetricCard label="Đơn đang chờ" value="42.5M" tone="red" />
      </div>
      <div className="mt-5 grid grid-cols-[1fr_340px] gap-5">
        <div className="space-y-5">
          <Panel title="Thông tin khách hàng">
            <dl className="grid grid-cols-2 gap-5">
              <Field label="Loại khách" value="Đại lý / cửa hàng" />
              <Field label="Price tier" value="DEALER" />
              <Field label="Người liên hệ" value="Nguyễn Văn Hùng · 0908 222 118" />
              <Field label="Email" value="hung@namphat.vn" />
              <Field label="Địa chỉ giao mặc định" value="12 Lê Trọng Tấn, Bình Tân, TP.HCM" />
              <Field label="Điều khoản thanh toán" value="30 ngày" />
              <Field label="Kho phục vụ" value="Kho Bình Dương" />
            </dl>
          </Panel>
          <Panel title="Dự án / địa điểm giao hàng">
            <div className="grid grid-cols-3 gap-3">
              {['PRJ-BT01 · Bình Tân', 'PRJ-Q7 · Quận 7', 'WH-NP · Kho Nam Phát'].map((project) => <div key={project} className="rounded-lg border border-slate-200 p-4 text-sm font-semibold">{project}</div>)}
            </div>
          </Panel>
          <Panel title="Đơn hàng gần đây"><OrderTable compact /></Panel>
        </div>
        <div className="space-y-5">
          <Panel title="Tóm tắt rủi ro">
            <p className="text-sm font-semibold">Credit utilization</p>
            <div className="mt-3 h-3 rounded-full bg-slate-100"><div className="h-3 w-[94%] rounded-full bg-amber-500" /></div>
            <p className="mt-2 text-sm text-slate-600">94% · còn 12.000.000đ · next payment 03/07/2026</p>
          </Panel>
          <HoldsPanel />
          <Panel title="Gợi ý từ AI">
            <p className="text-sm leading-6">Nên xác nhận lịch thanh toán hoặc tách đơn trước khi approve.</p>
            <div className="mt-4 flex gap-2"><ButtonLink to="/orders/OF-1025/ai-chat" variant="primary"><Bot size={16} /> Hỏi AI</ButtonLink><ButtonLink to="/orders/OF-1025">Xem đơn OF-1025</ButtonLink></div>
          </Panel>
        </div>
      </div>
    </>
  );
}
