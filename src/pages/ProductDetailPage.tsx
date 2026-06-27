import { Save } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { DraftLinesTable } from '../components/order-components';
import { Badge, Button, ButtonLink, Field, PageHeader, Panel } from '../components/ui';
import { products as fallbackProducts } from '../data/orderflow';
import { orderflowApi } from '../lib/orderflow-api';
import { aliasesForSku, mapProductView } from '../lib/orderflow-view';
import { useLoadable } from '../lib/use-loadable';

export function ProductDetailPage() {
  const { sku } = useParams();
  const productState = useLoadable(async () => {
    const [skus, balances, aliases] = await Promise.all([
      orderflowApi.productSkus(),
      orderflowApi.inventoryBalances(),
      orderflowApi.productAliases(),
    ]);
    const raw = skus.find((item) => item.id === sku || item.skuCode === sku) ?? skus[0];
    if (!raw) throw new Error('SKU not found');
    return {
      product: mapProductView(raw, balances),
      aliases: aliasesForSku(raw.id, aliases),
      raw,
    };
  }, [sku]);

  const fallback = fallbackProducts.find((item) => item.sku === sku) ?? fallbackProducts[0];
  const product = productState.data?.product ?? {
    id: fallback.sku,
    sku: fallback.sku,
    name: fallback.name,
    brand: fallback.brand,
    unit: fallback.unit,
    stock: fallback.stock,
    reserved: fallback.reserved,
    available: fallback.stock - fallback.reserved,
    price: fallback.price,
    status: fallback.status,
  };
  const aliases = productState.data?.aliases ?? ['ong PPR phi 25', 'PPR Binh Minh 25 PN20', 'ppr bm 25'];

  return (
    <>
      <PageHeader
        breadcrumb={`Products / ${product.sku}`}
        title={`SKU Detail - ${product.sku}`}
        meta={productState.error ? `Using demo fallback: ${productState.error}` : product.name}
        badges={[{ label: product.status, tone: product.status === 'ACTIVE' ? 'green' : 'amber' }]}
        actions={<><Button><Save size={16} /> Save</Button><ButtonLink to="/products">Back</ButtonLink></>}
      />
      <div className="grid grid-cols-[1fr_340px] gap-5">
        <div className="space-y-5">
          <Panel title="SKU information">
            <dl className="grid grid-cols-3 gap-5">
              <Field label="SKU" value={product.sku} />
              <Field label="Product" value={product.name} />
              <Field label="Brand" value={product.brand} />
              <Field label="Unit" value={product.unit} />
              <Field label="Price" value={product.price} />
              <Field label="Status" value={<Badge tone={product.status === 'ACTIVE' ? 'green' : 'amber'}>{product.status}</Badge>} />
            </dl>
          </Panel>
          <Panel title="Aliases for AI matching">
            <div className="flex flex-wrap gap-2">
              {aliases.length ? aliases.map((alias) => <Badge key={alias} tone="blue">{alias}</Badge>) : <Badge>No aliases</Badge>}
            </div>
          </Panel>
          <Panel title="Recent match history">
            <DraftLinesTable />
          </Panel>
        </div>
        <div className="space-y-5">
          <Panel title="Inventory">
            <div className="space-y-3">
              <Field label="On hand" value={`${product.stock} ${product.unit}`} />
              <Field label="Reserved" value={`${product.reserved} ${product.unit}`} />
              <Field label="Available" value={`${product.available} ${product.unit}`} />
            </div>
          </Panel>
          <Panel title="Technical fields">
            <div className="space-y-2">
              {[
                `Material: ${productState.data?.raw.material ?? '-'}`,
                `Diameter: ${productState.data?.raw.diameterMm ?? '-'}`,
                `Fitting: ${productState.data?.raw.fittingType ?? '-'}`,
              ].map((row) => <div key={row} className="rounded-lg border border-slate-200 p-3 text-sm font-semibold">{row}</div>)}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
