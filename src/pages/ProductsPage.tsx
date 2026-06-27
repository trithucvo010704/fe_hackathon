import { Filter, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../data/orderflow';
import { Badge, Button, PageHeader, Panel } from '../components/ui';

export function ProductsPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Sản phẩm"
        title="Danh mục SKU"
        meta="Quản lý SKU, alias, tồn kho và giá theo tier."
        actions={<><Button><Filter size={16} /> Bộ lọc</Button><Button variant="primary"><Plus size={16} /> Thêm SKU</Button></>}
      />
      <Panel>
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="px-4 py-3">SKU</th><th className="px-4 py-3">Tên sản phẩm</th><th className="px-4 py-3">Brand</th><th className="px-4 py-3">Tồn</th><th className="px-4 py-3">Giá DEALER</th><th className="px-4 py-3">Trạng thái</th><th></th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.sku}>
                  <td className="px-4 py-3 font-bold text-blue-700"><Link to={`/products/${product.sku}`}>{product.sku}</Link></td>
                  <td className="px-4 py-3">{product.name}</td>
                  <td className="px-4 py-3">{product.brand}</td>
                  <td className="px-4 py-3">{product.stock - product.reserved} {product.unit}</td>
                  <td className="px-4 py-3 font-semibold">{product.price}</td>
                  <td className="px-4 py-3"><Badge tone={product.status === 'ACTIVE' ? 'green' : 'amber'}>{product.status}</Badge></td>
                  <td className="px-4 py-3 text-right"><Link to={`/products/${product.sku}`} className="text-sm font-semibold text-blue-700">Chi tiết</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
