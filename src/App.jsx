import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CategoryPage from './components/CategoryPage';
// Import new page components
import AboutPage from './components/pages/AboutPage';
import PrivacyPage from './components/pages/PrivacyPage';
import TermsPage from './components/pages/TermsPage';
import FAQPage from './components/pages/FAQPage';
import ContactPage from './components/pages/ContactPage';
import DeliveryPage from './components/pages/DeliveryPage';
import StoresPage from './components/pages/StoresPage';
import ServicesPage from './components/pages/ServicesPage';
import SitemapPage from './components/pages/SitemapPage';
import InternationalPage from './components/pages/InternationalPage';
import InfoPage from './components/InfoPage';
import LoginRegister from './components/LoginRegister';
import StoresEvents from './components/StoresEvents';
import Wishlist from './components/Wishlist';
import Bag from './components/Bag';
import ProductDetails from './components/ProductDetails';
import Checkout from './components/Checkout';
import UserProfile from './components/UserProfile';
import BlogList from './components/BlogList';
import BlogDetail from './components/BlogDetail';

import OrderHistory from './components/OrderHistory';
import Home from './components/Home';
import EnhancedProductManager from './components/admin/EnhancedProductManager';
import UserManager from './components/admin/UserManager';
import OrderManager from './components/admin/OrderManager';
import AnalyticsDashboard from './components/admin/AnalyticsDashboard';
import CategoryManager from './components/admin/CategoryManager';
import InventoryManager from './components/admin/InventoryManager';
import ContentManager from './components/admin/ContentManager';
import SettingsManager from './components/admin/SettingsManager';
import NotificationSystem from './components/admin/NotificationSystem';
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { ConfirmProvider } from './context/ConfirmContext';
import { Toaster } from 'react-hot-toast';
import API_BASE_URL from './config';

import ScrollToTop from './components/ScrollToTop';
import MainLayout from './components/MainLayout';
import NotFound from './components/NotFound';

function App() {
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data.data || []))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  return (
    <ConfirmProvider>
      <AuthProvider>
        <ShopProvider>
          <AdminAuthProvider>
            <Router>
              <ScrollToTop />
              <div className="app">
                <Toaster
                  position="top-center"
                  toastOptions={{
                    style: {
                      background: '#333',
                      color: '#fff',
                    },
                    success: {
                      iconTheme: {
                        primary: '#fff',
                        secondary: '#333',
                      },
                    },
                  }}
                />
                <Routes>
                  {/* Admin Routes - Defined FIRST to ensure priority */}
                  <Route path="/admin/login" element={<AdminLogin />} />

                  <Route path="/admin" element={
                    <AdminProtectedRoute>
                      <AdminLayout />
                    </AdminProtectedRoute>
                  }>
                    <Route index element={<AdminDashboard />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="products" element={<EnhancedProductManager />} />
                    <Route path="users" element={<UserManager />} />
                    <Route path="orders" element={<OrderManager />} />
                    <Route path="analytics" element={<AnalyticsDashboard />} />
                    <Route path="categories" element={<CategoryManager />} />
                    <Route path="inventory" element={<InventoryManager />} />
                    <Route path="content" element={<ContentManager />} />
                    <Route path="settings" element={<SettingsManager />} />
                    <Route path="notifications" element={<NotificationSystem />} />
                  </Route>

                  {/* Main Website Routes */}
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home products={products} />} />
                    <Route path="new" element={<CategoryPage title="New Arrivals" />} />
                    <Route path="brands" element={<CategoryPage title="Brands" />} />
                    <Route path="makeup" element={<CategoryPage title="Makeup" />} />
                    <Route path="skincare" element={<CategoryPage title="Skincare" />} />
                    <Route path="hair" element={<CategoryPage title="Hair" />} />
                    <Route path="fragrance" element={<CategoryPage title="Fragrance" />} />
                    <Route path="bath-body" element={<CategoryPage title="Bath & Body" />} />
                    <Route path="artificial-jewellery" element={<CategoryPage title="Artificial Jewellery" />} />

                    {/* Footer Routes */}
                    <Route path="about" element={<AboutPage />} />
                    <Route path="privacy" element={<PrivacyPage />} />
                    <Route path="terms" element={<TermsPage />} />
                    <Route path="sitemap" element={<SitemapPage />} />
                    <Route path="international" element={<InternationalPage />} />
                    <Route path="faq" element={<FAQPage />} />
                    <Route path="delivery" element={<DeliveryPage />} />
                    <Route path="stores" element={<StoresPage />} />
                    <Route path="services" element={<ServicesPage />} />
                    <Route path="contact" element={<ContactPage />} />
                    <Route path="beauty-pass" element={<InfoPage title="Beauty Pass Benefits" />} />

                    {/* Auth Route */}
                    <Route path="login" element={<LoginRegister />} />

                    {/* Header Routes */}
                    <Route path="stores-events" element={<StoresEvents />} />
                    <Route path="wishlist" element={<Wishlist />} />
                    <Route path="bag" element={<Bag />} />
                    <Route path="product/:id" element={<ProductDetails />} />
                    <Route path="checkout" element={<Checkout />} />
                    <Route path="orders" element={<OrderHistory />} />
                    <Route path="profile" element={<UserProfile />} />
                    <Route path="blogs" element={<BlogList />} />
                    <Route path="blogs/:slug" element={<BlogDetail />} />

                    {/* Dynamic Category Routes - Place these LAST */}
                    {/* Using explicit paths to prevent ambiguity if possible, but fallback to params */}
                    <Route path=":category/:subcategory/:productType" element={<CategoryPage />} />
                    <Route path=":category/:subcategory" element={<CategoryPage />} />
                    <Route path=":category" element={<CategoryPage />} />
                  </Route>

                  {/* Catch All 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </Router>
          </AdminAuthProvider>
        </ShopProvider>
      </AuthProvider>
    </ConfirmProvider>
  );
}

export default App;
