import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CategoryPage from './components/CategoryPage';
import InfoPage from './components/InfoPage';
import LoginRegister from './components/LoginRegister';
import StoresEvents from './components/StoresEvents';
import Wishlist from './components/Wishlist';
import Bag from './components/Bag';
import ProductDetails from './components/ProductDetails';
import Home from './components/Home';
import AdminProductManager from './components/AdminProductManager';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';
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
        <Router>
          <div className="app">
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
              <Route path="/about" element={<InfoPage title="About The Vanity India" />} />
              <Route path="/privacy" element={<InfoPage title="Privacy Policy" />} />
              <Route path="/terms" element={<InfoPage title="Terms of Use" />} />
              <Route path="/sitemap" element={<InfoPage title="Sitemap" />} />
              <Route path="/international" element={<InfoPage title="International" />} />
              <Route path="/faq" element={<InfoPage title="FAQ" />} />
              <Route path="/delivery" element={<InfoPage title="Delivery" />} />
              <Route path="/stores" element={<InfoPage title="Find a Store" />} />
              <Route path="/services" element={<InfoPage title="Beauty Services" />} />
              <Route path="/contact" element={<InfoPage title="Contact Us" />} />
              <Route path="/beauty-pass" element={<InfoPage title="Beauty Pass Benefits" />} />

              {/* Auth Route */}
              <Route path="/login" element={<LoginRegister />} />

              {/* Header Routes */}
              <Route path="/stores-events" element={<StoresEvents />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/bag" element={<Bag />} />
              <Route path="/product/:id" element={<ProductDetails />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminProductManager />} />
              <Route path="/admin/products" element={<AdminProductManager />} />
            </Routes>

            <Footer />
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
      </ShopProvider>
    </AuthProvider>
  );
}

export default App;
