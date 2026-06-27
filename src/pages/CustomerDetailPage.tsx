import { Bot, CreditCard, Plus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { HoldsPanel, OrderTable } from '../components/order-components';
import { Button, ButtonLink, Field, MetricCard, PageHeader, Panel } from '../components/ui';
import { orderflowApi } from '../lib/orderflow-api';
import { formatCompactMoney, formatMoney, indexById, mapCustomerView, mapOrderItem } from '../lib/orderflow-view';
import { useLoadable } from '../lib/use-loadable';

export function CustomerDetailPage() {
  const { customerId } = useParams();
  const customerState = useLoadable(async () => {
    if (!customerId) throw new Error('Missing customer id');
    const [customer, credit, projects, orders, customers] = await Promise.all([
      orderflowApi.customer(customerId),
      orderflowApi.creditProfile(customerId).catch(() => null),
      orderflowApi.customerProjects(customerId).catch(() => []),
      orderflowApi.draftOrders().catch(() => []),
      orderflowApi.customers().catch(() => []),
    ]);
    const view = mapCustomerView(customer, credit ?? undefined);
    const customerOrders = orders.filter((order) => order.customerId === customerId);
    return {
      view,
      projects,
      orders: customerOrders.map((order) => mapOrderItem(order, undefined, indexById(customers))),
    };
  }, [customerId]);

  const customer = customerState.data?.view;
  const credit = customer?.credit;
  const available = Math.max((credit?.creditLimit ?? 0) - (credit?.currentDebt ?? 0) - (credit?.overdueDebt ?? 0) - (credit?.pendingApprovedOrderAmount ?? 0), 0);

  return (
    <>
      <PageHeader
        breadcrumb={`Customers / ${customer?.code ?? customerId ?? '-'}`}
        title={customer?.name ?? 'Customer detail'}
        meta={customerState.error ? `Using partial fallback: ${customerState.error}` : `${customer?.type ?? '-'} - Updated ${credit?.updatedAt ?? '-'}`}
        badges={[{ label: customer?.type ?? 'CUSTOMER', tone: 'blue' }, { label: customer?.raw.status ?? 'ACTIVE', tone: 'green' }, { label: customer?.risk ?? 'Normal', tone: customer?.risk === 'Normal' ? 'green' : 'amber' }]}
        actions={<><ButtonLink to="/orders/new" variant="primary"><Plus size={16} /> Create Order</ButtonLink><ButtonLink to={`/orders/${customerState.data?.orders[0]?.id ?? 'OF-1025'}/ai-chat`}><Bot size={16} /> AI Chat</ButtonLink><Button><CreditCard size={16} /> Check credit</Button><ButtonLink to="/customers">Back</ButtonLink></>}
      />
      <div className="grid grid-cols-5 gap-4">
        <MetricCard label="Credit limit" value={formatCompactMoney(credit?.creditLimit)} tone="blue" />
        <MetricCard label="Current debt" value={formatCompactMoney(credit?.currentDebt)} tone={(credit?.currentDebt ?? 0) > available ? 'amber' : 'green'} />
        <MetricCard label="Overdue" value={formatMoney(credit?.overdueDebt)} tone={(credit?.overdueDebt ?? 0) > 0 ? 'red' : 'green'} />
        <MetricCard label="Available" value={formatCompactMoney(available)} tone={available > 0 ? 'green' : 'red'} />
        <MetricCard label="Pending" value={formatCompactMoney(credit?.pendingApprovedOrderAmount)} tone="slate" />
      </div>
      <div className="mt-5 grid grid-cols-[1fr_340px] gap-5">
        <div className="space-y-5">
          <Panel title="Customer information">
            <dl className="grid grid-cols-2 gap-5">
              <Field label="Type" value={customer?.type ?? '-'} />
              <Field label="Price tier" value={customer?.raw.defaultPriceTier ?? '-'} />
              <Field label="Phone" value={customer?.raw.phone ?? '-'} />
              <Field label="Address" value={customer?.raw.address ?? '-'} />
              <Field label="Payment term" value={`${credit?.paymentTermDays ?? '-'} days`} />
              <Field label="Sales owner" value={customer?.owner ?? '-'} />
            </dl>
          </Panel>
          <Panel title="Projects / delivery locations">
            <div className="grid grid-cols-3 gap-3">
              {(customerState.data?.projects ?? []).length ? customerState.data!.projects.map((project) => (
                <div key={project.id} className="rounded-lg border border-slate-200 p-4 text-sm font-semibold">
                  {project.projectCode} - {project.name}
                  <p className="mt-1 text-xs text-slate-500">{project.deliveryAddress ?? '-'}</p>
                </div>
              )) : <p className="text-sm text-slate-500">No projects returned.</p>}
            </div>
          </Panel>
          <Panel title="Recent orders"><OrderTable compact items={customerState.data?.orders} /></Panel>
        </div>
        <div className="space-y-5">
          <Panel title="Credit risk">
            <p className="text-sm font-semibold">Credit utilization</p>
            <div className="mt-3 h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-amber-500" style={{ width: `${Math.min((((credit?.currentDebt ?? 0) + (credit?.overdueDebt ?? 0)) / Math.max(credit?.creditLimit ?? 1, 1)) * 100, 100)}%` }} /></div>
            <p className="mt-2 text-sm text-slate-600">{customer?.risk ?? 'Normal'} - available {formatMoney(available)}</p>
          </Panel>
          <HoldsPanel holds={[]} />
          <Panel title="AI suggestion">
            <p className="text-sm leading-6">Use credit profile and open holds before approving any new draft order.</p>
          </Panel>
        </div>
      </div>
    </>
  );
}
