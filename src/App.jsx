import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Providers
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { OrderProvider } from './context/OrderContext';
import { SubscriptionProvider } from './context/SubscriptionContext';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { WalletModal } from './components/common/WalletModal';
import { BlueprintModal } from './components/common/BlueprintModal';
import { AuthModal } from './pages/customer/AuthModal';

// Customer Pages
import { HomePage } from './pages/customer/HomePage';
import { ProductsPage } from './pages/customer/ProductsPage';
import { ProductDetailPage } from './pages/customer/ProductDetailPage';
import { CartPage } from './pages/customer/CartPage';
import { WishlistPage } from './pages/customer/WishlistPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { OrderConfirmationPage } from './pages/customer/OrderConfirmationPage';
import { OrdersPage } from './pages/customer/OrdersPage';
import { OrderDetailPage } from './pages/customer/OrderDetailPage';
import { SubscriptionsPage } from './pages/customer/SubscriptionsPage';
import { ProfilePage } from './pages/customer/ProfilePage';
import { AddressesPage } from './pages/customer/AddressesPage';
import { ReviewsPage } from './pages/customer/ReviewsPage';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminSubscriptions } from './pages/admin/AdminSubscriptions';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminOffers } from './pages/admin/AdminOffers';
import { AdminDelivery } from './pages/admin/AdminDelivery';
import { AdminReports } from './pages/admin/AdminReports';

// Delivery Pages
import { DeliveryDashboard } from './pages/delivery/DeliveryDashboard';
import { DeliveryOrders } from './pages/delivery/DeliveryOrders';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isDeliveryRoute = location.pathname.startsWith('/delivery');

  // Modals state
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isBlueprintOpen, setIsBlueprintOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');

  React.useEffect(() => {
    if (location.pathname === '/login') {
      setAuthTab('login');
      setIsAuthOpen(true);
    } else if (location.pathname === '/register') {
      setAuthTab('register');
      setIsAuthOpen(true);
    }
  }, [location.pathname]);

  return (
    <div className="app-container">
      {/* Header only on customer routes */}
      {!isAdminRoute && (
        <>
          {!isDeliveryRoute && (
            <Navbar
              onOpenWallet={() => setIsWalletOpen(true)}
              onOpenAuth={(tab) => {
                setAuthTab(tab || 'login');
                setIsAuthOpen(true);
              }}
            />
          )}
        </>
      )}

      {/* Main Body Routing */}
      <div className="main-content">
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/profile" element={<ProfilePage onOpenWallet={() => setIsWalletOpen(true)} />} />
          <Route path="/addresses" element={<AddressesPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />

          {/* Quick auth routes */}
          <Route path="/login" element={<HomePage />} />
          <Route path="/register" element={<HomePage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="subscriptions" element={<AdminSubscriptions />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="offers" element={<AdminOffers />} />
            <Route path="delivery" element={<AdminDelivery />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>

          {/* Delivery Partner Routes */}
          <Route path="/delivery" element={<DeliveryDashboard />} />
          <Route path="/delivery/orders" element={<DeliveryOrders />} />
          <Route path="/delivery/orders/:id" element={<OrderDetailPage />} />
        </Routes>
      </div>

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <WalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />
      <BlueprintModal isOpen={isBlueprintOpen} onClose={() => setIsBlueprintOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialTab={authTab} />

      {/* Footer on customer & delivery pages */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <WishlistProvider>
              <OrderProvider>
                <SubscriptionProvider>
                  <AppContent />
                </SubscriptionProvider>
              </OrderProvider>
            </WishlistProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
