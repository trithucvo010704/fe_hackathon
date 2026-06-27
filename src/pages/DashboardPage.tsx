import { ArrowRight, Database, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OrderTable } from '../components/order-components';
import { ButtonLink, MetricCard, PageHeader, Panel } from '../components/ui';

export function DashboardPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Dashboard"
        title="Dashboard OrderFlow AI"
        meta="Tổng quan đơn nháp, hold và hiệu suất AI hôm nay."
        actions={<ButtonLink to="/orders/new" variant="primary"><Plus size={16} /> Tạo đơn nháp</ButtonLink>}
      />
      <div className="grid grid-cols-5 gap-4">
        <MetricCard label="Đơn hôm nay" value="34" hint="+12% so với hôm qua" tone="blue" />
        <MetricCard label="Cần review" value="9" hint="4 credit, 3 SKU, 2 inventory" tone="amber" />
        <MetricCard label="Tự khớp SKU" value="82%" hint="214/261 dòng hàng" tone="green" />
        <MetricCard label="Thời gian AI" value="58s" hint="Trung vị mỗi đơn" tone="slate" />
        <MetricCard label="SLA sắp trễ" value="3" hint="Cần xử lý trước 15:00" tone="red" />
      </div>
      <div className="mt-5 grid grid-cols-[1fr_360px] gap-5">
        <Panel title="Đơn nháp gần đây">
          <OrderTable compact />
        </Panel>
        <Panel title="Hold cần xử lý">
          <div className="space-y-3">
            {['OF-1025 vượt hạn mức 30.5M', 'OF-1023 thiếu tồn kho phi 32', 'OF-1018 giá ngoài tier DEALER'].map((item, index) => (
              <Link key={item} to={index === 0 ? '/orders/OF-1025/review' : '/holds'} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
                <span className="text-sm font-semibold text-slate-800">{item}</span>
                <ArrowRight size={16} className="text-slate-400" />
              </Link>
            ))}
          </div>
        </Panel>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-5">
        {[
          ['Raw text', 34, 'Tin nhắn đã nhận'],
          ['AI extraction', 31, 'Đơn bóc tách thành công'],
          ['Approved', 18, 'Đơn đã duyệt/xuất'],
        ].map(([label, value, hint]) => (
          <Panel key={label as string}>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Database size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm font-semibold text-slate-700">{label}</p>
                <p className="text-xs text-slate-500">{hint}</p>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
