export type UUID = string;

export interface BaseResponse<T> {
  status: number;
  message: string;
  data: T | null;
}

export type DraftOrderStatus =
  | 'EXTRACTING'
  | 'NEEDS_CLARIFICATION'
  | 'ON_HOLD'
  | 'READY_FOR_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXPORTED'
  | string;

export type DraftOrderLineStatus =
  | 'EXTRACTED'
  | 'PENDING_MATCH'
  | 'NEEDS_CLARIFICATION'
  | 'MATCHED'
  | 'APPROVED'
  | 'REJECTED'
  | string;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CurrentUserDto {
  id: UUID;
  organizationId: UUID;
  organizationName: string;
  email: string;
  displayName: string;
  role: string;
}

export interface LoginResponseDto {
  accessToken: string;
  tokenType: string;
  user: CurrentUserDto;
}

export interface CustomerDto {
  id: UUID;
  organizationId: UUID;
  salesOwnerUserId?: UUID | null;
  customerCode: string;
  name: string;
  customerType: string;
  phone?: string | null;
  address?: string | null;
  defaultPriceTier?: string | null;
  status?: string | null;
  note?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface CustomerProjectDto {
  id: UUID;
  organizationId: UUID;
  customerId: UUID;
  projectCode: string;
  name: string;
  deliveryAddress?: string | null;
  defaultDeliveryNote?: string | null;
  active: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface CustomerCreditProfileDto {
  customerId: UUID;
  creditLimit: number;
  currentDebt: number;
  overdueDebt: number;
  pendingApprovedOrderAmount: number;
  paymentTermDays?: number | null;
  updatedAt?: string | null;
}

export interface WarehouseDto {
  id: UUID;
  organizationId: UUID;
  warehouseCode: string;
  name: string;
  address?: string | null;
  active: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface ProductSkuDto {
  id: UUID;
  organizationId: UUID;
  skuCode: string;
  productName: string;
  productFamily?: string | null;
  material?: string | null;
  brand?: string | null;
  diameterMm?: number | null;
  nominalSize?: string | null;
  sizeSystem?: string | null;
  pressureClass?: string | null;
  thicknessMm?: number | null;
  fittingType?: string | null;
  angleDegree?: number | null;
  threadType?: string | null;
  reducerFromMm?: number | null;
  reducerToMm?: number | null;
  lengthM?: number | null;
  sellUnit?: string | null;
  baseUnit?: string | null;
  unitsPerSellUnit?: number | null;
  active: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface ProductAliasDto {
  id: UUID;
  organizationId: UUID;
  aliasText: string;
  normalizedAlias: string;
  skuId?: UUID | null;
  productFamily?: string | null;
  material?: string | null;
  brand?: string | null;
  diameterMm?: number | null;
  pressureClass?: string | null;
  fittingType?: string | null;
  threadType?: string | null;
  confidenceWeight?: number | null;
  note?: string | null;
  active: boolean;
}

export interface InventoryBalanceDto {
  id: UUID;
  organizationId: UUID;
  warehouseId: UUID;
  skuId: UUID;
  onHandQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  updatedAt?: string | null;
}

export interface PriceListDto {
  id: UUID;
  organizationId: UUID;
  priceListCode: string;
  name: string;
  customerId?: UUID | null;
  priceTier?: string | null;
  validFrom?: string | null;
  validTo?: string | null;
  priority?: number | null;
  active: boolean;
}

export interface RawOrderTextDto {
  id: UUID;
  organizationId: UUID;
  sourceChannel: string;
  rawText: string;
  normalizedText?: string | null;
  extractionResult?: Record<string, unknown> | null;
  pastedByUserId?: UUID | null;
  receivedAt?: string | null;
  createdAt?: string | null;
}

export interface DraftOrderDto {
  id: UUID;
  organizationId: UUID;
  orderNo: string;
  rawOrderTextId?: UUID | null;
  customerId: UUID;
  projectId?: UUID | null;
  warehouseId: UUID;
  status: DraftOrderStatus;
  requestedDeliveryDate?: string | null;
  deliveryNote?: string | null;
  totalAmount?: number | null;
  clarificationQuestion?: string | null;
  createdByUserId?: UUID | null;
  readyForReviewAt?: string | null;
  approvedByUserId?: UUID | null;
  approvedAt?: string | null;
  rejectedByUserId?: UUID | null;
  rejectedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface DraftOrderLineDto {
  id: UUID;
  organizationId: UUID;
  draftOrderId: UUID;
  lineNo: number;
  rawLineText: string;
  itemDescription?: string | null;
  quantity: number;
  requestedUnit?: string | null;
  extractedAttributes?: Record<string, unknown> | null;
  selectedSkuId?: UUID | null;
  selectedByUserId?: UUID | null;
  selectedAt?: string | null;
  unitPrice?: number | null;
  priceSource?: string | null;
  lineAmount?: number | null;
  confidenceScore?: number | null;
  clarificationQuestion?: string | null;
  status: DraftOrderLineStatus;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface SkuCandidateDto {
  id: UUID;
  organizationId: UUID;
  draftOrderLineId: UUID;
  skuId: UUID;
  rankNo: number;
  confidenceScore?: number | null;
  matchReason?: string | null;
  matchedAttributes?: Record<string, unknown> | null;
  missingAttributes?: Record<string, unknown> | null;
  source?: string | null;
  createdAt?: string | null;
}

export interface PriceCheckDto {
  id: UUID;
  organizationId: UUID;
  draftOrderLineId: UUID;
  skuId?: UUID | null;
  priceListId?: UUID | null;
  quantity?: number | null;
  proposedUnitPrice?: number | null;
  referenceUnitPrice?: number | null;
  approvalFloorPrice?: number | null;
  status: string;
  reason?: string | null;
  checkedAt?: string | null;
}

export interface InventoryCheckDto {
  id: UUID;
  organizationId: UUID;
  draftOrderLineId: UUID;
  warehouseId?: UUID | null;
  skuId?: UUID | null;
  requestedQuantity?: number | null;
  onHandQuantity?: number | null;
  reservedQuantity?: number | null;
  availableQuantity?: number | null;
  status: string;
  reason?: string | null;
  checkedAt?: string | null;
}

export interface CreditCheckDto {
  id: UUID;
  organizationId: UUID;
  draftOrderId: UUID;
  customerId: UUID;
  orderAmount?: number | null;
  creditLimit?: number | null;
  currentDebt?: number | null;
  overdueDebt?: number | null;
  pendingApprovedOrderAmount?: number | null;
  projectedDebt?: number | null;
  status: string;
  reason?: string | null;
  checkedAt?: string | null;
}

export interface OrderHoldDto {
  id: UUID;
  organizationId: UUID;
  draftOrderId: UUID;
  draftOrderLineId?: UUID | null;
  holdType: string;
  severity?: string | null;
  status: string;
  reasonCode?: string | null;
  reasonMessage?: string | null;
  metadata?: Record<string, unknown> | null;
  createdByActorType?: string | null;
  releasedByUserId?: UUID | null;
  releasedAt?: string | null;
  releaseNote?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface DraftOrderDocumentDto {
  id: UUID;
  organizationId: UUID;
  draftOrderId: UUID;
  documentType: string;
  status: string;
  htmlSnapshot?: string | null;
  pdfPath?: string | null;
  generatedByUserId?: UUID | null;
  generatedAt?: string | null;
  createdAt?: string | null;
}

export interface ProcessingEventDto {
  id: UUID;
  organizationId: UUID;
  draftOrderId: UUID;
  stage: string;
  status: string;
  startedAt?: string | null;
  finishedAt?: string | null;
  durationMs?: number | null;
  metadata?: Record<string, unknown> | null;
}

export interface AuditEventDto {
  id: UUID;
  organizationId: UUID;
  draftOrderId: UUID;
  aggregateType?: string | null;
  aggregateId?: UUID | null;
  actorType?: string | null;
  actorUserId?: UUID | null;
  eventType: string;
  beforeData?: Record<string, unknown> | null;
  afterData?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
  createdAt?: string | null;
}

export interface ReviewActionDto {
  id: UUID;
  organizationId: UUID;
  draftOrderId: UUID;
  draftOrderLineId?: UUID | null;
  actionType: string;
  comment?: string | null;
  beforeData?: Record<string, unknown> | null;
  afterData?: Record<string, unknown> | null;
  actorUserId?: UUID | null;
  createdAt?: string | null;
}

export interface DraftOrderDetailDto {
  order: DraftOrderDto;
  rawOrderText?: RawOrderTextDto | null;
  lines: DraftOrderLineDto[];
  candidatesByLineId: Record<string, SkuCandidateDto[]>;
  priceChecksByLineId: Record<string, PriceCheckDto[]>;
  inventoryChecksByLineId: Record<string, InventoryCheckDto[]>;
  creditChecks: CreditCheckDto[];
  holds: OrderHoldDto[];
  documents: DraftOrderDocumentDto[];
  processingEvents: ProcessingEventDto[];
  auditEvents: AuditEventDto[];
  reviewActions: ReviewActionDto[];
}

export interface CreateDraftOrderRequest {
  customerId: UUID;
  projectId?: UUID | null;
  warehouseId: UUID;
  rawText: string;
}

export interface UpdateLineRequest {
  quantity?: number;
  requestedUnit?: string;
  itemDescription?: string;
}

export interface AgentInterpretRequest {
  orderId?: UUID | null;
  message: string;
  context?: Record<string, unknown>;
  organizationCode?: string | null;
  actorUserId?: UUID | null;
  customerCode?: string | null;
  warehouseCode?: string | null;
}

export interface AgentInterpretResponse {
  reply: string;
  intent: string;
  orderId?: UUID | null;
  guardrails: string[];
  suggestedActions: string[];
  canExport: boolean;
  openHoldCount: number;
  facts: Record<string, unknown>;
}

const TOKEN_KEY = 'orderflow_access_token';
const USER_KEY = 'orderflow_user';

function configuredOrigin() {
  const raw =
    import.meta.env.VITE_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:8080';
  return raw.replace(/\/+$/, '').replace(/\/app$/i, '').replace(/\/api$/i, '');
}

const API_ORIGIN = configuredOrigin();

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(login: LoginResponseDto) {
  localStorage.setItem(TOKEN_KEY, login.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(login.user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): CurrentUserDto | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CurrentUserDto;
  } catch {
    return null;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const headers = new Headers(init.headers);
  const hasBody = init.body !== undefined && init.body !== null;

  if (hasBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_ORIGIN}${path}`, { ...init, headers });
  let result: BaseResponse<T> | null = null;

  try {
    result = (await response.json()) as BaseResponse<T>;
  } catch {
    result = null;
  }

  if (response.status === 401) {
    clearSession();
  }

  if (!response.ok || !result || result.status !== 1) {
    throw new Error(result?.message || `API request failed: ${response.status}`);
  }

  return result.data as T;
}

function jsonBody(value: unknown) {
  return JSON.stringify(value);
}

export const orderflowApi = {
  login(body: LoginRequest) {
    return request<LoginResponseDto>('/api/auth/login', {
      method: 'POST',
      body: jsonBody(body),
    });
  },

  me() {
    return request<CurrentUserDto>('/api/auth/me');
  },

  logout() {
    return request<string>('/api/auth/logout', { method: 'POST' });
  },

  customers() {
    return request<CustomerDto[]>('/api/customers');
  },

  customer(id: UUID) {
    return request<CustomerDto>(`/api/customers/${id}`);
  },

  customerProjects(customerId: UUID) {
    return request<CustomerProjectDto[]>(`/api/customers/${customerId}/projects`);
  },

  creditProfile(customerId: UUID) {
    return request<CustomerCreditProfileDto>(`/api/credit-profiles/${customerId}`);
  },

  warehouses() {
    return request<WarehouseDto[]>('/api/warehouses');
  },

  productSkus() {
    return request<ProductSkuDto[]>('/api/products/skus');
  },

  productSku(id: UUID) {
    return request<ProductSkuDto>(`/api/products/skus/${id}`);
  },

  productAliases() {
    return request<ProductAliasDto[]>('/api/products/aliases');
  },

  inventoryBalances(warehouseId?: UUID) {
    const query = warehouseId ? `?warehouseId=${encodeURIComponent(warehouseId)}` : '';
    return request<InventoryBalanceDto[]>(`/api/inventory/balances${query}`);
  },

  priceLists() {
    return request<PriceListDto[]>('/api/price-lists');
  },

  draftOrders(status?: DraftOrderStatus) {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return request<DraftOrderDto[]>(`/api/draft-orders${query}`);
  },

  draftOrder(id: UUID) {
    return request<DraftOrderDetailDto>(`/api/draft-orders/${id}`);
  },

  createDraftOrder(body: CreateDraftOrderRequest) {
    return request<DraftOrderDetailDto>('/api/draft-orders/from-text', {
      method: 'POST',
      body: jsonBody(body),
    });
  },

  interpretAgent(body: AgentInterpretRequest) {
    return request<AgentInterpretResponse>('/api/agent/interpret', {
      method: 'POST',
      body: jsonBody(body),
    });
  },

  runChecks(id: UUID) {
    return request<DraftOrderDetailDto>(`/api/draft-orders/${id}/run-checks`, {
      method: 'POST',
    });
  },

  approveOrder(id: UUID) {
    return request<DraftOrderDto>(`/api/draft-orders/${id}/approve`, {
      method: 'POST',
    });
  },

  rejectOrder(id: UUID, reason?: string) {
    return request<DraftOrderDto>(`/api/draft-orders/${id}/reject`, {
      method: 'POST',
      body: jsonBody({ reason: reason || '' }),
    });
  },

  updateLine(lineId: UUID, body: UpdateLineRequest) {
    return request<DraftOrderLineDto>(`/api/draft-order-lines/${lineId}`, {
      method: 'PATCH',
      body: jsonBody(body),
    });
  },

  matchSkus(lineId: UUID) {
    return request<SkuCandidateDto[]>(`/api/draft-order-lines/${lineId}/match-skus`, {
      method: 'POST',
    });
  },

  skuCandidates(lineId: UUID) {
    return request<SkuCandidateDto[]>(`/api/draft-order-lines/${lineId}/sku-candidates`);
  },

  selectSku(lineId: UUID, skuId: UUID) {
    return request<DraftOrderLineDto>(`/api/draft-order-lines/${lineId}/select-sku`, {
      method: 'POST',
      body: jsonBody({ skuId }),
    });
  },

  rejectLine(lineId: UUID, reason?: string) {
    return request<DraftOrderLineDto>(`/api/draft-order-lines/${lineId}/reject`, {
      method: 'POST',
      body: jsonBody({ reason: reason || '' }),
    });
  },

  holds(orderId: UUID) {
    return request<OrderHoldDto[]>(`/api/draft-orders/${orderId}/holds`);
  },

  releaseHold(holdId: UUID, note?: string) {
    return request<OrderHoldDto>(`/api/order-holds/${holdId}/release`, {
      method: 'POST',
      body: jsonBody({ note: note || '' }),
    });
  },

  generateQuote(orderId: UUID) {
    return request<DraftOrderDocumentDto>(`/api/draft-orders/${orderId}/documents/quote`, {
      method: 'POST',
    });
  },

  generatePickList(orderId: UUID) {
    return request<DraftOrderDocumentDto>(`/api/draft-orders/${orderId}/documents/pick-list`, {
      method: 'POST',
    });
  },

  documents(orderId: UUID) {
    return request<DraftOrderDocumentDto[]>(`/api/draft-orders/${orderId}/documents`);
  },

  processingEvents(orderId: UUID) {
    return request<ProcessingEventDto[]>(`/api/draft-orders/${orderId}/processing-events`);
  },

  auditEvents(orderId: UUID) {
    return request<AuditEventDto[]>(`/api/draft-orders/${orderId}/audit-events`);
  },

  reviewActions(orderId: UUID) {
    return request<ReviewActionDto[]>(`/api/draft-orders/${orderId}/review-actions`);
  },
};
