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

// Route Protection
import { ProtectedRoute } from './routes/ProtectedRoute';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { WalletModal } from './components/common/WalletModal';
import { BlueprintModal } from './components/common/BlueprintModal';
import { AuthModal } from './pages/customer/AuthModal';

// Auth & Shared Pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { ForgotPasswordFlow } from './pages/auth/ForgotPasswordFlow';
import { UnauthorizedPage } from './pages/auth/UnauthorizedPage';
import { NotFoundPage } from './pages/auth/NotFoundPage';

// Customer Pages
import { HomePage } from './pages/customer/HomePage';
import { ProductsPage } from './pages/customer/ProductsPage';
import { ProductDetailPage } from './pages/customer/ProductDetailPage';
import { CartPage } from './pages/customer/CartPage';
import { WishlistPage } from './pages/customer/WishlistPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { OrderConfirmationPage } from './pages/customer/OrderConfirmationPage';
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { CustomerWalletPage } from './pages/customer/CustomerWalletPage';
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

// Delivery Partner Pages
import { PartnerRoutePage } from './pages/delivery/PartnerRoutePage';
import { PartnerBottleLog } from './pages/delivery/PartnerBottleLog';
import { DeliveryDashboard } from './pages/delivery/DeliveryDashboard';
import { DeliveryOrders } from './pages/delivery/DeliveryOrders';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isDeliveryRoute = location.pathname.startsWith('/delivery') || location.pathname.startsWith('/partner');

  // Modals state
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isBlueprintOpen, setIsBlueprintOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');

  return (
    <div className="app-container">
      {/* Header only on non-admin routes */}
      {!isAdminRoute && (
        <Navbar
          onOpenWallet={() => setIsWalletOpen(true)}
          onOpenAuth={(tab) => {
            setAuthTab(tab || 'login');
            setIsAuthOpen(true);
          }}
        />
      )}

      {/* Main Body Routing */}
      <div className="main-content">
        <Routes>
          {/* Public & Customer Storefront Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />

          {/* Authentication & Shared Access Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordFlow />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Customer Portal (/account/*) - Protected */}
          <Route
            path="/account"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboard onOpenWallet={() => setIsWalletOpen(true)} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/orders"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/subscriptions"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <SubscriptionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/wallet"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerWalletPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/addresses"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <AddressesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/profile"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <ProfilePage onOpenWallet={() => setIsWalletOpen(true)} />
              </ProtectedRoute>
            }
          />

          {/* Customer Orders, Checkout & Aliases */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-confirmation"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <OrderConfirmationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route
            path="/subscriptions"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <SubscriptionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <ProfilePage onOpenWallet={() => setIsWalletOpen(true)} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addresses"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <AddressesPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Operations Hub (/admin/*) - Protected */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="subscriptions" element={<AdminSubscriptions />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="offers" element={<AdminOffers />} />
            <Route path="delivery" element={<AdminDelivery />} />
            <Route path="partners" element={<AdminDelivery />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>

          {/* Delivery Partner Portal (/partner/* & /delivery/*) - Protected */}
          <Route
            path="/partner"
            element={
              <ProtectedRoute allowedRoles={['delivery']}>
                <PartnerRoutePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner/today"
            element={
              <ProtectedRoute allowedRoles={['delivery']}>
                <PartnerRoutePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner/deliveries"
            element={
              <ProtectedRoute allowedRoles={['delivery']}>
                <PartnerRoutePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner/bottles"
            element={
              <ProtectedRoute allowedRoles={['delivery']}>
                <PartnerBottleLog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner/profile"
            element={
              <ProtectedRoute allowedRoles={['delivery']}>
                <ProfilePage onOpenWallet={() => setIsWalletOpen(true)} />
              </ProtectedRoute>
            }
          />

          {/* Legacy Delivery Route Aliases */}
          <Route
            path="/delivery"
            element={
              <ProtectedRoute allowedRoles={['delivery']}>
                <PartnerRoutePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery/orders"
            element={
              <ProtectedRoute allowedRoles={['delivery']}>
                <DeliveryOrders />
              </ProtectedRoute>
            }
          />
          <Route path="/delivery/orders/:id" element={<OrderDetailPage />} />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
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
