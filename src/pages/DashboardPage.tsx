import { ArrowRight, Database, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OrderTable } from '../components/order-components';
import { ButtonLink, MetricCard, PageHeader, Panel } from '../components/ui';
import { orderflowApi } from '../lib/orderflow-api';
import { dashboardMetrics, indexById, mapOrderItem } from '../lib/orderflow-view';
import { useLoadable } from '../lib/use-loadable';

export function DashboardPage() {
  const dashboardState = useLoadable(async () => {
    const [orders, customers] = await Promise.all([
      orderflowApi.draftOrders(),
      orderflowApi.customers(),
    ]);
    const customersById = indexById(customers);
    return {
      metrics: dashboardMetrics(orders),
      orders: orders.slice(0, 6).map((order) => mapOrderItem(order, undefined, customersById)),
      reviewOrders: orders.filter((order) => ['ON_HOLD', 'NEEDS_CLARIFICATION', 'READY_FOR_REVIEW'].includes(order.status)).slice(0, 5),
    };
  }, []);

  const metrics = dashboardState.data?.metrics ?? [
    { label: 'Orders today', value: '34', hint: 'Demo fallback', tone: 'blue' as const },
    { label: 'Need review', value: '9', hint: 'Demo fallback', tone: 'amber' as const },
    { label: 'Auto matched', value: '82%', hint: 'Demo fallback', tone: 'green' as const },
    { label: 'AI time', value: '58s', hint: 'Demo fallback', tone: 'slate' as const },
    { label: 'SLA risk', value: '3', hint: 'Demo fallback', tone: 'red' as const },
  ];

  return (
    <>
      <PageHeader
        breadcrumb="Dashboard"
        title="Dashboard OrderFlow AI"
        meta={dashboardState.error ? `Using demo fallback: ${dashboardState.error}` : 'Live overview from OrderFlow backend.'}
        actions={<ButtonLink to="/orders/new" variant="primary"><Plus size={16} /> Create Draft Order</ButtonLink>}
      />
      <div className="grid grid-cols-5 gap-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} label={metric.label} value={metric.value} hint={metric.hint} tone={metric.tone} />
        ))}
      </div>
      <div className="mt-5 grid grid-cols-[1fr_360px] gap-5">
        <Panel title="Recent draft orders">
          <OrderTable compact items={dashboardState.data?.orders} />
        </Panel>
        <Panel title="Needs review">
          <div className="space-y-3">
            {(dashboardState.data?.reviewOrders ?? []).length ? dashboardState.data!.reviewOrders.map((order) => (
              <Link key={order.id} to={`/orders/${order.id}/review`} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
                <span className="text-sm font-semibold text-slate-800">{order.orderNo} - {order.status}</span>
                <ArrowRight size={16} className="text-slate-400" />
              </Link>
            )) : ['OF-1025 credit hold', 'OF-1023 stock hold', 'OF-1018 price hold'].map((item) => (
              <Link key={item} to="/holds" className="flex items-center justify-between rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
                <span className="text-sm font-semibold text-slate-800">{item}</span>
                <ArrowRight size={16} className="text-slate-400" />
              </Link>
            ))}
          </div>
        </Panel>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-5">
        {[
          ['Raw text', dashboardState.data?.metrics[0]?.value ?? '34', 'Received draft order text'],
          ['Rule-ready', dashboardState.data?.metrics[1]?.value ?? '9', 'Orders in review states'],
          ['Approved', dashboardState.data?.metrics[2]?.value ?? '18', 'Approved/exported orders'],
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
