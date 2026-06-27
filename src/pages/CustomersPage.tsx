import { Filter, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, Button, PageHeader, Panel } from '../components/ui';
import { customers as fallbackCustomers } from '../data/orderflow';
import { orderflowApi, type CustomerCreditProfileDto } from '../lib/orderflow-api';
import { mapCustomerView } from '../lib/orderflow-view';
import { useLoadable } from '../lib/use-loadable';

export function CustomersPage() {
  const customersState = useLoadable(async () => {
    const customers = await orderflowApi.customers();
    const credits = await Promise.allSettled(customers.map((customer) => orderflowApi.creditProfile(customer.id)));
    const creditByCustomer = new Map<string, CustomerCreditProfileDto>();
    credits.forEach((result) => {
      if (result.status === 'fulfilled') creditByCustomer.set(result.value.customerId, result.value);
    });
    return customers.map((customer) => mapCustomerView(customer, creditByCustomer.get(customer.id)));
  }, []);

  const rows = customersState.data ?? fallbackCustomers.map((customer) => ({
    id: customer.id,
    code: customer.id,
    name: customer.name,
    type: customer.type,
    owner: customer.owner,
    debt: customer.debt,
    limit: customer.limit,
    available: customer.available,
    risk: customer.risk,
    raw: {
      id: customer.id,
      organizationId: '',
      customerCode: customer.id,
      name: customer.name,
      customerType: customer.type,
    },
  }));

  return (
    <>
      <PageHeader
        breadcrumb="Customers"
        title="Customers"
        meta={customersState.error ? `Using demo fallback: ${customersState.error}` : 'Live customers from backend master data.'}
        actions={<><Button><Filter size={16} /> Filter</Button><Button variant="primary"><Plus size={16} /> Add customer</Button></>}
      />
      <Panel>
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="px-4 py-3">Code</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Sales owner</th><th className="px-4 py-3">Debt</th><th className="px-4 py-3">Available</th><th className="px-4 py-3">Risk</th><th></th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-4 py-3 font-bold text-blue-700"><Link to={`/customers/${customer.id}`}>{customer.code}</Link></td>
                  <td className="px-4 py-3 font-semibold">{customer.name}</td>
                  <td className="px-4 py-3">{customer.type}</td>
                  <td className="px-4 py-3">{customer.owner}</td>
                  <td className="px-4 py-3">{customer.debt}</td>
                  <td className="px-4 py-3">{customer.available}</td>
                  <td className="px-4 py-3"><Badge tone={customer.risk === 'Normal' ? 'green' : 'amber'}>{customer.risk}</Badge></td>
                  <td className="px-4 py-3 text-right"><Link to={`/customers/${customer.id}`} className="text-sm font-semibold text-blue-700">Detail</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
