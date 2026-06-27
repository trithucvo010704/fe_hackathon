import { Save } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { DraftLinesTable } from '../components/order-components';
import { Badge, Button, ButtonLink, Field, PageHeader, Panel } from '../components/ui';
import { products } from '../data/orderflow';

export function ProductDetailPage() {
  const { sku } = useParams();
  const product = products.find((item) => item.sku === sku) ?? products[0];

  return (
    <>
      <PageHeader
        breadcrumb={`Sản phẩm / ${product.sku}`}
        title={`Chi tiết SKU - ${product.sku}`}
        meta={product.name}
        badges={[{ label: product.status, tone: product.status === 'ACTIVE' ? 'green' : 'amber' }]}
        actions={<><Button><Save size={16} /> Lưu thay đổi</Button><ButtonLink to="/products">Quay lại</ButtonLink></>}
      />
      <div className="grid grid-cols-[1fr_340px] gap-5">
        <div className="space-y-5">
          <Panel title="Thông tin SKU">
            <dl className="grid grid-cols-3 gap-5">
              <Field label="SKU" value={product.sku} />
              <Field label="Tên sản phẩm" value={product.name} />
              <Field label="Brand" value={product.brand} />
              <Field label="Đơn vị" value={product.unit} />
              <Field label="Giá DEALER" value={product.price} />
              <Field label="Trạng thái" value={<Badge tone="green">ACTIVE</Badge>} />
            </dl>
          </Panel>
          <Panel title="Alias phục vụ AI matching">
            <div className="flex flex-wrap gap-2">
              {['ống PPR phi 25', 'PPR Bình Minh 25 PN20', 'ống nhựa BM 25', 'ppr bm 25'].map((alias) => <Badge key={alias} tone="blue">{alias}</Badge>)}
            </div>
          </Panel>
          <Panel title="Lịch sử match gần đây">
            <DraftLinesTable />
          </Panel>
        </div>
        <div className="space-y-5">
          <Panel title="Tồn kho">
            <div className="space-y-3">
              <Field label="Kho Bình Dương" value={`${product.stock - product.reserved} ${product.unit}`} />
              <Field label="Đang giữ" value={`${product.reserved} ${product.unit}`} />
              <Field label="Ngưỡng cảnh báo" value={`100 ${product.unit}`} />
            </div>
          </Panel>
          <Panel title="Giá theo tier">
            <div className="space-y-2">
              {['DEALER 125.000đ', 'STORE 132.000đ', 'DISTRIBUTOR 119.000đ'].map((row) => <div key={row} className="rounded-lg border border-slate-200 p-3 text-sm font-semibold">{row}</div>)}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
