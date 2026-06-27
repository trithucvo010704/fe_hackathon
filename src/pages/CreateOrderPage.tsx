import { Save, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckList, DraftLinesTable } from '../components/order-components';
import { Button, Field, PageHeader, Panel } from '../components/ui';

export function CreateOrderPage() {
  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        breadcrumb="Đơn nháp / Tạo mới"
        title="Tạo đơn nháp"
        meta="Nhập tin nhắn bán hàng, AI sẽ bóc tách SKU/số lượng và chạy rule check."
        actions={<Button variant="primary" onClick={() => navigate('/orders/OF-1025')}><Save size={16} /> Lưu đơn nháp</Button>}
      />
      <div className="grid grid-cols-[1fr_360px] gap-5">
        <div className="space-y-5">
          <Panel title="Nguồn đơn hàng">
            <div className="grid grid-cols-3 gap-3">
              {['Zalo', 'Email', 'Manual'].map((item, index) => (
                <button key={item} className={index === 0 ? 'rounded-lg border border-blue-300 bg-blue-50 p-4 text-left' : 'rounded-lg border border-slate-200 bg-white p-4 text-left'}>
                  <p className="font-bold">{item}</p>
                  <p className="mt-1 text-xs text-slate-500">{index === 0 ? 'Tin nhắn khách gửi' : 'Nhập liệu nội bộ'}</p>
                </button>
              ))}
            </div>
          </Panel>
          <Panel title="Nội dung gốc">
            <textarea
              className="min-h-44 w-full resize-none rounded-lg border border-slate-200 p-4 text-sm leading-6 outline-none focus:border-blue-400"
              defaultValue="Nam Phát lấy ống PPR Bình Minh phi 25 PN20 300 cây, co 90 phi 25 120 cái, keo dán 20 hộp. Giao Bình Tân, cần báo giá hôm nay."
            />
            <div className="mt-4 flex justify-end">
              <Button variant="primary" onClick={() => navigate('/orders/OF-1025/review')}><Sparkles size={16} /> Bóc tách bằng AI</Button>
            </div>
          </Panel>
          <Panel title="Preview bóc tách">
            <DraftLinesTable />
          </Panel>
        </div>
        <div className="space-y-5">
          <Panel title="Rule check dự kiến">
            <CheckList />
          </Panel>
          <Panel title="Khách hàng gợi ý">
            <div className="space-y-3">
              <Field label="Khách hàng" value={<Link to="/customers/KH-002" className="text-blue-700">Đại lý Nam Phát</Link>} />
              <Field label="Price tier" value="DEALER" />
              <Field label="Công nợ hiện tại" value={<span className="text-amber-700">188.000.000đ / 200.000.000đ</span>} />
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
