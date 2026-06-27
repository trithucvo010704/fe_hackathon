import { Filter, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, Button, PageHeader, Panel } from '../components/ui';
import { customers } from '../data/orderflow';

export function CustomersPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Khách hàng"
        title="Danh sách Khách hàng"
        meta="Khách mua hàng của công ty: cửa hàng, đại lý, nhà phân phối và dự án."
        actions={<><Button><Filter size={16} /> Bộ lọc</Button><Button variant="primary"><Plus size={16} /> Thêm khách</Button></>}
      />
      <Panel>
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="px-4 py-3">Mã</th><th className="px-4 py-3">Khách hàng</th><th className="px-4 py-3">Loại</th><th className="px-4 py-3">Sales owner</th><th className="px-4 py-3">Công nợ</th><th className="px-4 py-3">Khả dụng</th><th className="px-4 py-3">Risk</th><th></th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-4 py-3 font-bold text-blue-700"><Link to={`/customers/${customer.id}`}>{customer.id}</Link></td>
                  <td className="px-4 py-3 font-semibold">{customer.name}</td>
                  <td className="px-4 py-3">{customer.type}</td>
                  <td className="px-4 py-3">{customer.owner}</td>
                  <td className="px-4 py-3">{customer.debt}</td>
                  <td className="px-4 py-3">{customer.available}</td>
                  <td className="px-4 py-3"><Badge tone={customer.risk === 'Normal' ? 'green' : 'amber'}>{customer.risk}</Badge></td>
                  <td className="px-4 py-3 text-right"><Link to={`/customers/${customer.id}`} className="text-sm font-semibold text-blue-700">Chi tiết</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
