import { Download, Eye } from 'lucide-react';
import { CheckList, DraftLinesTable, OrderTabs } from '../components/order-components';
import { Button, ButtonLink, Field, PageHeader, Panel } from '../components/ui';

export function PreviewPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Đơn nháp / OF-1025 / Preview"
        title="Xem trước tài liệu - OF-1025"
        meta="Bản xem trước báo giá chỉ được xuất khi hold đã giải quyết."
        badges={[{ label: 'Preview locked', tone: 'amber' }]}
        actions={<><ButtonLink to="/orders/OF-1025/review"><Eye size={16} /> Mở Review</ButtonLink><Button disabled><Download size={16} /> Xuất PDF</Button></>}
      />
      <OrderTabs />
      <div className="grid grid-cols-[1fr_320px] gap-5">
        <Panel>
          <div className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-10 shadow-sm">
            <div className="flex justify-between">
              <div>
                <p className="text-2xl font-bold">BÁO GIÁ</p>
                <p className="mt-1 text-sm text-slate-500">OF-1025 · 27/06/2026</p>
              </div>
              <div className="text-right">
                <p className="font-bold">Bình Minh Trading</p>
                <p className="text-sm text-slate-500">OrderFlow AI MVP</p>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
              <Field label="Khách hàng" value="Đại lý Nam Phát" />
              <Field label="Địa chỉ giao" value="12 Lê Trọng Tấn, Bình Tân, TP.HCM" />
            </div>
            <div className="mt-8"><DraftLinesTable /></div>
            <div className="mt-8 flex justify-end">
              <div className="w-72 space-y-2 text-sm">
                <div className="flex justify-between"><span>Tạm tính</span><strong>42.500.000đ</strong></div>
                <div className="flex justify-between"><span>VAT</span><strong>4.250.000đ</strong></div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-lg"><span>Tổng</span><strong>46.750.000đ</strong></div>
              </div>
            </div>
          </div>
        </Panel>
        <Panel title="Trạng thái xuất tài liệu">
          <CheckList />
        </Panel>
      </div>
    </>
  );
}
