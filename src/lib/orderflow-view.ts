import type { BadgeTone, MetricTone } from '../data/orderflow';
import {
  type CreditCheckDto,
  type CustomerCreditProfileDto,
  type CustomerDto,
  type DraftOrderDetailDto,
  type DraftOrderDto,
  type DraftOrderLineDto,
  type InventoryBalanceDto,
  type OrderHoldDto,
  type ProcessingEventDto,
  type ProductAliasDto,
  type ProductSkuDto,
  type ReviewActionDto,
  type SkuCandidateDto,
  type UUID,
} from './orderflow-api';

export interface OrderListItem {
  id: UUID;
  code: string;
  customer: string;
  source: string;
  owner: string;
  createdAt: string;
  total: string;
  lines: number;
  matched: string;
  holds: string[];
  status: string;
}

export interface DraftLineView {
  id: UUID;
  row: number;
  original: string;
  sku: string;
  qty: string;
  price: string;
  amount: string;
  status: string;
}

export interface CheckItemView {
  label: string;
  value: string;
  tone: BadgeTone;
}

export interface ProductView {
  id: UUID;
  sku: string;
  name: string;
  brand: string;
  unit: string;
  stock: number;
  reserved: number;
  available: number;
  price: string;
  status: string;
}

export interface CustomerView {
  id: UUID;
  code: string;
  name: string;
  type: string;
  owner: string;
  debt: string;
  limit: string;
  available: string;
  risk: string;
  raw: CustomerDto;
  credit?: CustomerCreditProfileDto;
}

export interface HoldView {
  id: UUID;
  orderId: UUID;
  orderCode: string;
  type: string;
  severity: string;
  owner: string;
  sla: string;
  message: string;
  status: string;
}

export interface EventView {
  id: string;
  time: string;
  code: string;
  detail: string;
  actor: string;
}

export interface DashboardMetricView {
  label: string;
  value: string;
  hint?: string;
  tone: MetricTone;
}

export function formatMoney(value?: number | null) {
  if (value === undefined || value === null) return '-';
  return `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value)}d`;
}

export function formatCompactMoney(value?: number | null) {
  if (value === undefined || value === null) return '-';
  if (Math.abs(value) >= 1_000_000) {
    return `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(value / 1_000_000)}M`;
  }
  return formatMoney(value);
}

export function formatNumber(value?: number | null) {
  if (value === undefined || value === null) return '-';
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(value);
}

export function formatDateTime(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatTime(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
}

export function indexById<T extends { id: UUID }>(items: T[]) {
  return new Map(items.map((item) => [item.id, item]));
}

export function customerName(customer?: CustomerDto) {
  return customer?.name || 'Unknown customer';
}

export function orderCode(order?: DraftOrderDto | null) {
  return order?.orderNo || 'Draft order';
}

export function lineSkuLabel(line: DraftOrderLineDto, skusById?: Map<UUID, ProductSkuDto>) {
  if (!line.selectedSkuId) return 'Chua chon SKU';
  return skusById?.get(line.selectedSkuId)?.skuCode || line.selectedSkuId;
}

export function mapOrderItem(
  order: DraftOrderDto,
  detail?: DraftOrderDetailDto,
  customersById?: Map<UUID, CustomerDto>,
) {
  const lines = detail?.lines || [];
  const matched = lines.filter((line) => line.selectedSkuId || ['MATCHED', 'APPROVED'].includes(line.status)).length;
  const holds = (detail?.holds || []).filter((hold) => hold.status === 'OPEN');

  return {
    id: order.id,
    code: order.orderNo,
    customer: customerName(customersById?.get(order.customerId)),
    source: detail?.rawOrderText?.sourceChannel || 'MANUAL_TEXT',
    owner: order.createdByUserId || '-',
    createdAt: formatDateTime(order.createdAt),
    total: formatMoney(order.totalAmount),
    lines: lines.length,
    matched: lines.length ? `${matched}/${lines.length}` : '-',
    holds: holds.map((hold) => hold.holdType),
    status: order.status,
  } satisfies OrderListItem;
}

export function mapLineView(line: DraftOrderLineDto, skusById?: Map<UUID, ProductSkuDto>) {
  return {
    id: line.id,
    row: line.lineNo,
    original: line.rawLineText,
    sku: lineSkuLabel(line, skusById),
    qty: `${formatNumber(line.quantity)} ${line.requestedUnit || ''}`.trim(),
    price: formatMoney(line.unitPrice),
    amount: formatMoney(line.lineAmount),
    status: line.status,
  } satisfies DraftLineView;
}

export function mapCheckItems(detail?: DraftOrderDetailDto | null) {
  if (!detail) return [];

  const totalLines = detail.lines.length;
  const matchedLines = detail.lines.filter((line) => line.selectedSkuId || ['MATCHED', 'APPROVED'].includes(line.status)).length;
  const priceChecks = Object.values(detail.priceChecksByLineId || {}).flat();
  const inventoryChecks = Object.values(detail.inventoryChecksByLineId || {}).flat();
  const creditCheck = detail.creditChecks?.[0];
  const openHolds = detail.holds.filter((hold) => hold.status === 'OPEN');

  return [
    {
      label: 'SKU matching',
      value: totalLines ? `${matchedLines}/${totalLines} matched` : 'No lines',
      tone: matchedLines === totalLines && totalLines > 0 ? 'green' : 'amber',
    },
    {
      label: 'Price check',
      value: summarizeRuleChecks(priceChecks),
      tone: ruleTone(priceChecks.map((item) => item.status)),
    },
    {
      label: 'Inventory',
      value: summarizeRuleChecks(inventoryChecks),
      tone: ruleTone(inventoryChecks.map((item) => item.status)),
    },
    {
      label: 'Credit',
      value: creditCheck ? `${creditCheck.status}${creditCheck.reason ? ` - ${creditCheck.reason}` : ''}` : 'Not checked',
      tone: creditCheck ? ruleTone([creditCheck.status]) : 'slate',
    },
    {
      label: 'Open holds',
      value: `${openHolds.length}`,
      tone: openHolds.length ? 'red' : 'green',
    },
  ] satisfies CheckItemView[];
}

function summarizeRuleChecks(items: Array<{ status: string }>) {
  if (!items.length) return 'Not checked';
  const pass = items.filter((item) => item.status === 'PASS').length;
  const fail = items.filter((item) => item.status === 'FAIL').length;
  const warn = items.filter((item) => item.status === 'WARN').length;
  if (fail) return `${fail} fail / ${items.length}`;
  if (warn) return `${warn} warn / ${items.length}`;
  return `${pass}/${items.length} pass`;
}

function ruleTone(statuses: string[]): BadgeTone {
  if (!statuses.length) return 'slate';
  if (statuses.some((status) => status === 'FAIL')) return 'red';
  if (statuses.some((status) => status === 'WARN')) return 'amber';
  return 'green';
}

export function mapProductView(sku: ProductSkuDto, balances: InventoryBalanceDto[] = []) {
  const relevant = balances.filter((balance) => balance.skuId === sku.id);
  const stock = sum(relevant.map((balance) => balance.onHandQuantity));
  const reserved = sum(relevant.map((balance) => balance.reservedQuantity));
  const available = sum(relevant.map((balance) => balance.availableQuantity));

  return {
    id: sku.id,
    sku: sku.skuCode,
    name: sku.productName,
    brand: sku.brand || '-',
    unit: sku.sellUnit || sku.baseUnit || '-',
    stock,
    reserved,
    available,
    price: '-',
    status: sku.active ? 'ACTIVE' : 'INACTIVE',
  } satisfies ProductView;
}

export function mapCustomerView(customer: CustomerDto, credit?: CustomerCreditProfileDto) {
  const creditLimit = credit?.creditLimit ?? 0;
  const currentDebt = credit?.currentDebt ?? 0;
  const overdueDebt = credit?.overdueDebt ?? 0;
  const pending = credit?.pendingApprovedOrderAmount ?? 0;
  const available = Math.max(creditLimit - currentDebt - overdueDebt - pending, 0);
  const utilization = creditLimit > 0 ? (currentDebt + overdueDebt + pending) / creditLimit : 0;

  return {
    id: customer.id,
    code: customer.customerCode || customer.id,
    name: customer.name,
    type: customer.customerType || '-',
    owner: customer.salesOwnerUserId || '-',
    debt: formatMoney(currentDebt),
    limit: formatMoney(creditLimit),
    available: formatMoney(available),
    risk: overdueDebt > 0 || utilization >= 0.9 ? 'Watch credit' : 'Normal',
    raw: customer,
    credit,
  } satisfies CustomerView;
}

export function mapHoldView(hold: OrderHoldDto, order?: DraftOrderDto | null) {
  return {
    id: hold.id,
    orderId: hold.draftOrderId,
    orderCode: order?.orderNo || hold.draftOrderId,
    type: hold.reasonCode || hold.holdType,
    severity: hold.severity || (hold.holdType === 'CREDIT_HOLD' || hold.holdType === 'STOCK_HOLD' ? 'High' : 'Medium'),
    owner: hold.createdByActorType || 'Sales',
    sla: hold.createdAt ? ageLabel(hold.createdAt) : '-',
    message: hold.reasonMessage || hold.reasonCode || hold.holdType,
    status: hold.status,
  } satisfies HoldView;
}

export function mapEvents(
  processingEvents: ProcessingEventDto[] = [],
  reviewActions: ReviewActionDto[] = [],
) {
  const events: EventView[] = [
    ...processingEvents.map((event) => ({
      id: event.id,
      time: formatTime(event.startedAt),
      code: event.stage,
      detail: event.status,
      actor: 'system',
    })),
    ...reviewActions.map((action) => ({
      id: action.id,
      time: formatTime(action.createdAt),
      code: action.actionType,
      detail: action.comment || 'Review action',
      actor: 'user',
    })),
  ];

  return events.sort((a, b) => b.time.localeCompare(a.time));
}

export function candidateSku(candidate: SkuCandidateDto, skusById?: Map<UUID, ProductSkuDto>) {
  const sku = skusById?.get(candidate.skuId);
  return {
    code: sku?.skuCode || candidate.skuId,
    name: sku?.productName || 'SKU candidate',
    confidence: candidate.confidenceScore === undefined || candidate.confidenceScore === null
      ? '-'
      : `${Math.round(candidate.confidenceScore * 100)}%`,
    reason: candidate.matchReason || candidate.source || '-',
  };
}

export function aliasesForSku(skuId: UUID, aliases: ProductAliasDto[]) {
  return aliases.filter((alias) => alias.skuId === skuId).map((alias) => alias.aliasText);
}

export function dashboardMetrics(orders: DraftOrderDto[]) {
  const needsReview = orders.filter((order) => ['ON_HOLD', 'NEEDS_CLARIFICATION', 'READY_FOR_REVIEW'].includes(order.status)).length;
  const approved = orders.filter((order) => order.status === 'APPROVED' || order.status === 'EXPORTED').length;

  return [
    { label: 'Don hom nay', value: String(orders.length), hint: 'Tu API draft-orders', tone: 'blue' },
    { label: 'Can review', value: String(needsReview), hint: 'Hold, clarification, ready', tone: 'amber' },
    { label: 'Approved', value: String(approved), hint: 'Da duyet hoac exported', tone: 'green' },
    { label: 'Tong gia tri', value: formatCompactMoney(sum(orders.map((order) => order.totalAmount || 0))), tone: 'slate' },
    { label: 'Rejected', value: String(orders.filter((order) => order.status === 'REJECTED').length), tone: 'red' },
  ] satisfies DashboardMetricView[];
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + (Number.isFinite(value) ? value : 0), 0);
}

function ageLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  const minutes = Math.max(Math.round((Date.now() - date.getTime()) / 60000), 0);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours}h ${rest}m`;
}
