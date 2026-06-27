import { Filter, Plus } from 'lucide-react';
import { OrderTable } from '../components/order-components';
import { Button, ButtonLink, PageHeader, Panel } from '../components/ui';
import { orderflowApi } from '../lib/orderflow-api';
import { indexById, mapOrderItem } from '../lib/orderflow-view';
import { useLoadable } from '../lib/use-loadable';

export function OrdersPage() {
  const ordersState = useLoadable(async () => {
    const [orders, customers] = await Promise.all([
      orderflowApi.draftOrders(),
      orderflowApi.customers(),
    ]);
    const customersById = indexById(customers);
    return orders.map((order) => mapOrderItem(order, undefined, customersById));
  }, []);

  const items = ordersState.data ?? undefined;
  const needsReview = items?.filter((order) => ['ON_HOLD', 'NEEDS_CLARIFICATION', 'READY_FOR_REVIEW'].includes(order.status)).length ?? 0;

  return (
    <>
      <PageHeader
        breadcrumb="Draft orders"
        title="Draft Orders"
        meta={ordersState.error ? `Using demo fallback: ${ordersState.error}` : 'Live list from GET /api/draft-orders.'}
        badges={[
          { label: ordersState.loading ? 'Loading' : `${items?.length ?? 0} live orders`, tone: 'blue' },
          { label: `${needsReview} need review`, tone: needsReview ? 'amber' : 'green' },
        ]}
        actions={<><Button><Filter size={16} /> Filter</Button><ButtonLink to="/orders/new" variant="primary"><Plus size={16} /> Create Order</ButtonLink></>}
      />
      <Panel>
        <OrderTable items={items} />
      </Panel>
    </>
  );
}
