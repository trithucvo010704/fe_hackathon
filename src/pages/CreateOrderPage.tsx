import { Save, Sparkles } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckList, DraftLinesTable } from '../components/order-components';
import { Button, Field, PageHeader, Panel } from '../components/ui';
import { orderflowApi, type CustomerProjectDto } from '../lib/orderflow-api';
import { useLoadable } from '../lib/use-loadable';

const sampleText = 'Cong ty Minh Anh dat 10 cay ong Binh Minh phi 21 va 5 co 90 phi 27, giao cong trinh Quan 7 ngay 2026-06-29 gio hanh chinh.';

export function CreateOrderPage() {
  const navigate = useNavigate();
  const masterData = useLoadable(async () => {
    const [customers, warehouses] = await Promise.all([
      orderflowApi.customers(),
      orderflowApi.warehouses(),
    ]);
    return { customers, warehouses };
  }, []);

  const [customerId, setCustomerId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState<CustomerProjectDto[]>([]);
  const [rawText, setRawText] = useState(sampleText);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const customers = masterData.data?.customers ?? [];
  const warehouses = masterData.data?.warehouses ?? [];
  const selectedCustomer = useMemo(() => customers.find((customer) => customer.id === customerId), [customers, customerId]);
  const selectedWarehouse = useMemo(() => warehouses.find((warehouse) => warehouse.id === warehouseId), [warehouses, warehouseId]);

  useEffect(() => {
    if (!customerId && customers[0]) setCustomerId(customers[0].id);
  }, [customers, customerId]);

  useEffect(() => {
    if (!warehouseId && warehouses[0]) setWarehouseId(warehouses[0].id);
  }, [warehouses, warehouseId]);

  useEffect(() => {
    let active = true;
    if (!customerId) {
      setProjects([]);
      setProjectId('');
      return;
    }
    orderflowApi.customerProjects(customerId)
      .then((items) => {
        if (!active) return;
        setProjects(items);
        setProjectId(items[0]?.id ?? '');
      })
      .catch(() => {
        if (!active) return;
        setProjects([]);
        setProjectId('');
      });
    return () => {
      active = false;
    };
  }, [customerId]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!customerId || !warehouseId || !rawText.trim()) {
      setError('Customer, warehouse, and raw text are required.');
      return;
    }

    setSubmitting(true);
    try {
      const detail = await orderflowApi.createDraftOrder({
        customerId,
        warehouseId,
        projectId: projectId || null,
        rawText,
      });
      navigate(`/orders/${detail.order.id}/review`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create draft order failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PageHeader
        breadcrumb="Draft orders / Create"
        title="Create Draft Order"
        meta={masterData.error ? `Master data fallback unavailable: ${masterData.error}` : 'Create with POST /api/draft-orders/from-text.'}
        actions={<Button type="submit" variant="primary" disabled={submitting}><Save size={16} /> {submitting ? 'Creating...' : 'Create draft'}</Button>}
      />
      <div className="grid grid-cols-[1fr_360px] gap-5">
        <div className="space-y-5">
          <Panel title="Source">
            <div className="grid grid-cols-3 gap-3">
              {['MANUAL_TEXT', 'ZALO_COPY', 'EMAIL_COPY'].map((item, index) => (
                <button key={item} type="button" className={index === 0 ? 'rounded-lg border border-blue-300 bg-blue-50 p-4 text-left' : 'rounded-lg border border-slate-200 bg-white p-4 text-left'}>
                  <p className="font-bold">{item}</p>
                  <p className="mt-1 text-xs text-slate-500">{index === 0 ? 'MVP supported source' : 'Display-only source'}</p>
                </button>
              ))}
            </div>
          </Panel>
          <Panel title="Raw order text">
            <textarea
              className="min-h-44 w-full resize-none rounded-lg border border-slate-200 p-4 text-sm leading-6 outline-none focus:border-blue-400"
              value={rawText}
              onChange={(event) => setRawText(event.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <Button type="submit" variant="primary" disabled={submitting}><Sparkles size={16} /> Extract and create</Button>
            </div>
            {error && <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
          </Panel>
          <Panel title="Preview">
            <DraftLinesTable lines={[]} />
          </Panel>
        </div>
        <div className="space-y-5">
          <Panel title="Order context">
            <div className="space-y-3">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Customer</span>
                <select className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" value={customerId} onChange={(event) => setCustomerId(event.target.value)}>
                  {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.customerCode} - {customer.name}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Project</span>
                <select className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" value={projectId} onChange={(event) => setProjectId(event.target.value)}>
                  <option value="">No project</option>
                  {projects.map((project) => <option key={project.id} value={project.id}>{project.projectCode} - {project.name}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Warehouse</span>
                <select className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" value={warehouseId} onChange={(event) => setWarehouseId(event.target.value)}>
                  {warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.warehouseCode} - {warehouse.name}</option>)}
                </select>
              </label>
            </div>
          </Panel>
          <Panel title="Expected checks">
            <CheckList items={[]} />
          </Panel>
          <Panel title="Selected data">
            <div className="space-y-3">
              <Field label="Customer" value={selectedCustomer?.name ?? '-'} />
              <Field label="Price tier" value={selectedCustomer?.defaultPriceTier ?? '-'} />
              <Field label="Warehouse" value={selectedWarehouse?.name ?? '-'} />
            </div>
          </Panel>
        </div>
      </div>
    </form>
  );
}
