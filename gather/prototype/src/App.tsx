import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { OpsProvider } from './context/OpsContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import ProductPage from './pages/ProductPage';
import VendorPage from './pages/VendorPage';
import VendorsPage from './pages/VendorsPage';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import SearchPage from './pages/SearchPage';

// Operations Dashboard pages
import OpsLayout from './pages/ops/OpsLayout';
import DashboardPage from './pages/ops/DashboardPage';
import OrdersPage from './pages/ops/OrdersPage';
import PickListsPage from './pages/ops/PickListsPage';
import CheckInPage from './pages/ops/CheckInPage';

function App() {
  return (
    <OpsProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Customer-facing routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="browse" element={<BrowsePage />} />
              <Route path="browse/:category" element={<BrowsePage />} />
              <Route path="product/:slug" element={<ProductPage />} />
              <Route path="vendor/:slug" element={<VendorPage />} />
              <Route path="vendors" element={<VendorsPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="confirmation/:orderId" element={<ConfirmationPage />} />
              <Route path="search" element={<SearchPage />} />
            </Route>

            {/* Operations Dashboard routes */}
            <Route path="/ops" element={<OpsLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="pick-lists" element={<PickListsPage />} />
              <Route path="check-in" element={<CheckInPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </OpsProvider>
  );
}

export default App;
