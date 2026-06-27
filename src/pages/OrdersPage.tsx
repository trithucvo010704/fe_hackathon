import { Filter, Plus } from 'lucide-react';
import { OrderTable } from '../components/order-components';
import { Button, ButtonLink, PageHeader, Panel } from '../components/ui';

export function OrdersPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Đơn nháp"
        title="Danh sách Đơn nháp"
        meta="Theo dõi trạng thái bóc tách, hold và review của từng đơn."
        badges={[{ label: '34 đơn hôm nay', tone: 'blue' }, { label: '9 cần review', tone: 'amber' }]}
        actions={<><Button><Filter size={16} /> Bộ lọc</Button><ButtonLink to="/orders/new" variant="primary"><Plus size={16} /> Tạo đơn</ButtonLink></>}
      />
      <Panel>
        <OrderTable />
      </Panel>
    </>
  );
}
