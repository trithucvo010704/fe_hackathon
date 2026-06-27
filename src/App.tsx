import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { CreateOrderPage } from './pages/CreateOrderPage';
import { CustomerDetailPage } from './pages/CustomerDetailPage';
import { CustomersPage } from './pages/CustomersPage';
import { DashboardPage } from './pages/DashboardPage';
import { EventsPage } from './pages/EventsPage';
import { HoldsPage } from './pages/HoldsPage';
import { LoginPage } from './pages/LoginPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { OrdersPage } from './pages/OrdersPage';
import { PreviewPage } from './pages/PreviewPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ProductsPage } from './pages/ProductsPage';
import { ReviewPage } from './pages/ReviewPage';
import { SalesAiChatPage } from './pages/SalesAiChatPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/new" element={<CreateOrderPage />} />
        <Route path="/orders/:orderId" element={<OrderDetailPage />} />
        <Route path="/orders/:orderId/review" element={<ReviewPage />} />
        <Route path="/orders/:orderId/ai-chat" element={<SalesAiChatPage />} />
        <Route path="/orders/:orderId/chat" element={<Navigate to="/orders/OF-1025/ai-chat" replace />} />
        <Route path="/orders/:orderId/preview" element={<PreviewPage />} />
        <Route path="/orders/:orderId/events" element={<EventsPage />} />
        <Route path="/holds" element={<HoldsPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:sku" element={<ProductDetailPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/customers/:customerId" element={<CustomerDetailPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
