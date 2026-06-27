import { Filter, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, Button, PageHeader, Panel } from '../components/ui';
import { products as fallbackProducts } from '../data/orderflow';
import { orderflowApi } from '../lib/orderflow-api';
import { mapProductView } from '../lib/orderflow-view';
import { useLoadable } from '../lib/use-loadable';

export function ProductsPage() {
  const productsState = useLoadable(async () => {
    const [skus, balances] = await Promise.all([
      orderflowApi.productSkus(),
      orderflowApi.inventoryBalances(),
    ]);
    return skus.map((sku) => mapProductView(sku, balances));
  }, []);

  const productRows = productsState.data ?? fallbackProducts.map((product) => ({
    id: product.sku,
    sku: product.sku,
    name: product.name,
    brand: product.brand,
    unit: product.unit,
    stock: product.stock,
    reserved: product.reserved,
    available: product.stock - product.reserved,
    price: product.price,
    status: product.status,
  }));

  return (
    <>
      <PageHeader
        breadcrumb="Products"
        title="SKU Catalog"
        meta={productsState.error ? `Using demo fallback: ${productsState.error}` : 'Live SKU catalog from backend.'}
        actions={<><Button><Filter size={16} /> Filter</Button><Button variant="primary"><Plus size={16} /> Add SKU</Button></>}
      />
      <Panel>
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="px-4 py-3">SKU</th><th className="px-4 py-3">Product</th><th className="px-4 py-3">Brand</th><th className="px-4 py-3">Available</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Status</th><th></th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {productRows.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3 font-bold text-blue-700"><Link to={`/products/${product.id}`}>{product.sku}</Link></td>
                  <td className="px-4 py-3">{product.name}</td>
                  <td className="px-4 py-3">{product.brand}</td>
                  <td className="px-4 py-3">{product.available} {product.unit}</td>
                  <td className="px-4 py-3 font-semibold">{product.price}</td>
                  <td className="px-4 py-3"><Badge tone={product.status === 'ACTIVE' ? 'green' : 'amber'}>{product.status}</Badge></td>
                  <td className="px-4 py-3 text-right"><Link to={`/products/${product.id}`} className="text-sm font-semibold text-blue-700">Detail</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
