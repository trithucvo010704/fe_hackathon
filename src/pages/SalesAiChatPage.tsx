import { AlertTriangle, ArrowRight, Download, Eye, Paperclip, RefreshCw, Save, Send } from 'lucide-react';
import { draftLines } from '../data/orderflow';
import { HoldsPanel, OrderTabs } from '../components/order-components';
import { Badge, Button, ButtonLink, cx, MetricCard, PageHeader, Panel } from '../components/ui';

function ChatBubble({ who, text, user }: { who: string; text: string; user?: boolean }) {
  return (
    <div className={cx('flex', user ? 'justify-end' : 'justify-start')}>
      <div className={cx('max-w-[620px] rounded-lg px-4 py-3 text-sm leading-6', user ? 'bg-blue-600 text-white' : 'border border-slate-200 bg-white text-slate-800')}>
        <p className={cx('mb-1 text-xs font-bold', user ? 'text-blue-100' : 'text-slate-500')}>{who}</p>
        <p>{text}</p>
      </div>
    </div>
  );
}

export function SalesAiChatPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Đơn nháp / OF-1025 / AI Chat"
        title="Sales AI Chat - OF-1025"
        meta="Đại lý Nam Phát · Nguồn Zalo · Tạo bởi Trần Bình · 27/06/2026 09:42"
        badges={[{ label: 'ON_HOLD', tone: 'red' }, { label: 'Credit hold', tone: 'amber' }, { label: 'SKU cần xác nhận', tone: 'blue' }]}
        actions={<><ButtonLink to="/orders/OF-1025/review" variant="primary"><Eye size={16} /> Mở Review</ButtonLink><Button><RefreshCw size={16} /> Chạy kiểm tra lại</Button><Button><Save size={16} /> Lưu ghi chú</Button><Button disabled><Download size={16} /> Xuất báo giá</Button></>}
      />
      <OrderTabs />
      <div className="grid min-h-[720px] grid-cols-[300px_minmax(520px,1fr)_320px] gap-5">
        <Panel title="Ngữ cảnh đơn hàng" className="self-start">
          <div className="space-y-5">
            <div>
              <p className="font-bold">Đại lý Nam Phát</p>
              <p className="mt-1 text-sm text-slate-500">DEALER · Sales owner Trần Bình</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <MetricCard label="Tổng" value="42.5M" tone="slate" />
              <MetricCard label="Hold" value="2" tone="red" />
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6">Nam Phát lấy ống PPR Bình Minh phi 25 PN20 300 cây, co 90 phi 25 120 cái, keo dán 20 hộp. Giao Bình Tân, cần báo giá hôm nay.</div>
            <div className="space-y-2">
              {draftLines.map((line) => (
                <div key={line.row} className="rounded-lg border border-slate-200 p-3">
                  <p className="text-sm font-semibold">{line.sku}</p>
                  <p className="text-xs text-slate-500">{line.qty} · {line.status}</p>
                </div>
              ))}
            </div>
          </div>
        </Panel>
        <Panel title="Trao đổi với AI" action={<Badge tone="blue">AI hỗ trợ Sales</Badge>}>
          <p className="mb-4 text-sm text-slate-500">AI chỉ đề xuất và giải thích, không tự approve hoặc release hold.</p>
          <div className="space-y-4">
            <ChatBubble who="AI" text="Mình thấy đơn OF-1025 đang có 2 điểm cần xử lý: SKU keo dán chưa rõ và công nợ vượt hạn mức 30.500.000đ. Bạn muốn xử lý phần nào trước?" />
            <ChatBubble who="Sales" text="Kiểm tra giúp tôi SKU keo dán phù hợp với PPR Bình Minh." user />
            <ChatBubble who="AI" text="Có 2 SKU gần nhất: GLUE-PPR-BM-500 và GLUE-PPR-STD-250. Với số lượng 20 hộp và nhóm hàng PPR Bình Minh, mình đề xuất GLUE-PPR-BM-500, độ tin cậy 82%. Cần Sales xác nhận trước khi chạy lại kiểm tra." />
            <ChatBubble who="Sales" text="Công nợ hiện tại của khách thế nào?" user />
            <ChatBubble who="AI" text="Khách còn hạn mức khả dụng 12.000.000đ. Đơn 42.500.000đ sẽ vượt 30.500.000đ. Gợi ý: thu thêm thanh toán, tách đơn, hoặc xin duyệt ngoại lệ." />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {['Xác nhận SKU keo dán', 'Giải thích credit hold', 'Soạn tin nhắn gửi khách', 'Tạo checklist review'].map((chip) => (
              <button key={chip} className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">{chip}</button>
            ))}
          </div>
          <div className="mt-5 flex items-end gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white"><Paperclip size={18} /></button>
            <textarea className="min-h-12 flex-1 resize-none bg-transparent text-sm outline-none" placeholder="Nhập câu hỏi cho AI..." />
            <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white"><Send size={18} /></button>
          </div>
        </Panel>
        <div className="space-y-5">
          <Panel title="Dữ liệu & hành động">
            <div className="grid grid-cols-3 gap-2">
              <MetricCard label="Confidence" value="82%" tone="blue" />
              <MetricCard label="Last run" value="58s" tone="green" />
              <MetricCard label="Status" value="OK" tone="slate" />
            </div>
          </Panel>
          <HoldsPanel />
          <Panel title="Quick actions">
            <div className="space-y-2">
              {['Gắn ghi chú vào đơn', 'Tạo review action', 'Mở chi tiết khách hàng', 'Chạy kiểm tra sau khi xác nhận SKU'].map((item) => (
                <button key={item} className="flex w-full items-center justify-between rounded-lg border border-slate-200 p-3 text-left text-sm font-semibold hover:bg-slate-50">
                  {item}<ArrowRight size={15} />
                </button>
              ))}
            </div>
          </Panel>
          <Panel>
            <div className="flex gap-3 text-sm leading-6 text-amber-800">
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />
              AI không được tự approve đơn, đổi giá, release hold hoặc xuất báo giá khi còn lỗi rule check.
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
