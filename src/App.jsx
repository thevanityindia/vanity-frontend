import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
import Home from './components/Home';
import EnhancedProductManager from './components/admin/EnhancedProductManager';
import UserManager from './components/admin/UserManager';
// import OrderManager from './components/admin/OrderManager';
import AnalyticsDashboard from './components/admin/AnalyticsDashboard';
import CategoryManager from './components/admin/CategoryManager';
import InventoryManager from './components/admin/InventoryManager';
// import ContentManager from './components/admin/ContentManager';
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
import { Toaster } from 'react-hot-toast';

function App() {
  const [products, setProducts] = React.useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  return (
    <AuthProvider>
      <ShopProvider>
        <AdminAuthProvider>
          <Router>
            <div className="app">
              <Routes>
                {/* Admin Routes */}
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
                  <Route path="orders" element={<div>Order Manager - Coming Soon</div>} />
                  <Route path="analytics" element={<AnalyticsDashboard />} />
                  <Route path="categories" element={<CategoryManager />} />
                  <Route path="inventory" element={<InventoryManager />} />
                  <Route path="content" element={<div>Content Manager - Coming Soon</div>} />
                  <Route path="settings" element={<SettingsManager />} />
                  <Route path="notifications" element={<NotificationSystem />} />
                </Route>

                {/* Main Website Routes */}
                <Route path="/*" element={
                  <>
                    <div className="sticky-header-container">
                      <Header toggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} isMenuOpen={isMobileMenuOpen} />
                      <Navbar isOpen={isMobileMenuOpen} closeMenu={() => setIsMobileMenuOpen(false)} />
                    </div>

                    <Routes>
                      <Route path="/" element={<Home products={products} />} />
                      <Route path="/new" element={<CategoryPage title="New Arrivals" />} />
                      <Route path="/brands" element={<CategoryPage title="Brands" />} />
                      <Route path="/makeup" element={<CategoryPage title="Makeup" />} />
                      <Route path="/skincare" element={<CategoryPage title="Skincare" />} />
                      <Route path="/hair" element={<CategoryPage title="Hair" />} />
                      <Route path="/fragrance" element={<CategoryPage title="Fragrance" />} />
                      <Route path="/bath-body" element={<CategoryPage title="Bath & Body" />} />
                      <Route path="/artificial-jewellery" element={<CategoryPage title="Artificial Jewellery" />} />

                      {/* Footer Routes */}
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/privacy" element={<PrivacyPage />} />
                      <Route path="/terms" element={<TermsPage />} />
                      <Route path="/sitemap" element={<SitemapPage />} />
                      <Route path="/international" element={<InternationalPage />} />
                      <Route path="/faq" element={<FAQPage />} />
                      <Route path="/delivery" element={<DeliveryPage />} />
                      <Route path="/stores" element={<StoresPage />} />
                      <Route path="/services" element={<ServicesPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/beauty-pass" element={<InfoPage title="Beauty Pass Benefits" />} />

                      {/* Auth Route */}
                      <Route path="/login" element={<LoginRegister />} />

                      {/* Header Routes */}
                      <Route path="/stores-events" element={<StoresEvents />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/bag" element={<Bag />} />
                      <Route path="/product/:id" element={<ProductDetails />} />
                    </Routes>

                    <Footer />
                  </>
                } />
              </Routes>

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
            </div>
          </Router>
        </AdminAuthProvider>
      </ShopProvider>
    </AuthProvider>
  );
}

export default App;
