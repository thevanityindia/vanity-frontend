import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaHeart, FaShoppingBag, FaSearch, FaMapMarkerAlt, FaIdCard, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo.jpg';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import API_BASE_URL from '../config';

import Fuse from 'fuse.js';
import './Header.css';
import MiniBag from './MiniBag';

const Header = ({ toggleMenu, isMenuOpen }) => {
    const { user, isAuthenticated, logout } = useAuth();
    const { cartItems, wishlistItems } = useShop();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [didYouMean, setDidYouMean] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMiniBagOpen, setIsMiniBagOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPos = window.scrollY;
            // High threshold to fold (200px) and very low to unfold (20px)
            // This ensures the 100px+ height change of the header doesn't cause a loop
            setIsScrolled(prev => {
                if (scrollPos > 200 && !prev) return true;
                if (scrollPos < 20 && prev) return false;
                return prev;
            });
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [allProducts, setAllProducts] = useState([]);

    // Fetch all products for search
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/products`);
                if (res.ok) {
                    const data = await res.json();
                    setAllProducts(data);
                }
            } catch (err) {
                console.error('Error fetching products for search:', err);
            }
        };
        fetchProducts();
    }, []);

    // Initialize Fuse with fetched products
    const fuse = new Fuse(allProducts, {
        keys: ['name', 'brand', 'category'],
        threshold: 0.4,
        includeScore: true
    });

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/');
    };

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        setDidYouMean(null);

        if (val.length > 1) {
            const results = fuse.search(val);

            if (results.length > 0) {
                // Show top 5 matches
                setSuggestions(results.slice(0, 5).map(r => r.item));
            } else {
                setSuggestions([]);
                // Try to find a "Did you mean" suggestion with looser threshold
                const looseFuse = new Fuse(allProducts, {
                    keys: ['name', 'brand'],
                    threshold: 0.7
                });
                const looseResults = looseFuse.search(val);
                if (looseResults.length > 0) {
                    setDidYouMean(looseResults[0].item);
                }
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (productId) => {
        navigate(`/product/${productId}`);
        setQuery('');
        setSuggestions([]);
        setDidYouMean(null);
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const wishlistCount = wishlistItems.length;

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="top-bar">
                <div className="top-bar-left">
                    {!isAuthenticated ? (
                        <Link to="/login" className="top-link">
                            <FaUser /> <span>Sign In / Register</span>
                        </Link>
                    ) : (
                        <div className="top-link user-menu">
                            <Link to="/profile" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <FaUser /> <span>Hi, {user?.name || user?.firstName}</span>
                            </Link>
                            <span className="separator">|</span>
                            <a href="#" onClick={handleLogout} className="logout-link">
                                <FaSignOutAlt /> Logout
                            </a>
                        </div>
                    )}

                </div>
                <div className="top-bar-right">
                    <Link to="/stores-events" className="top-link">
                        <FaMapMarkerAlt /> <span>Stores & Events</span>
                    </Link>
                    <Link to="/wishlist" className="top-link" style={{ position: 'relative' }}>
                        <FaHeart /> <span>Wishlist</span>
                        {wishlistCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                background: '#e63946',
                                color: '#fff',
                                borderRadius: '50%',
                                fontSize: '0.7rem',
                                width: '18px',
                                height: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold'
                            }}>
                                {wishlistCount}
                            </span>
                        )}
                    </Link>
                    <div
                        className="top-link bag-link-container"
                        style={{ position: 'relative' }}
                        onMouseEnter={() => setIsMiniBagOpen(true)}
                        onMouseLeave={() => setIsMiniBagOpen(false)}
                    >
                        <Link to="/bag" className="top-link bag-link">
                            <FaShoppingBag /> <span>Bag</span>
                            {cartCount > 0 && (
                                <span className="bag-count-badge">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <MiniBag isOpen={isMiniBagOpen} onClose={() => setIsMiniBagOpen(false)} />
                    </div>
                </div>
            </div>
            <div className="header-main">
                <div className="header-top-row">
                    <div className="mobile-menu-trigger" onClick={toggleMenu}>
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </div>

                    <Link to="/" className="logo-container">
                        <img src={logo} alt="The Vanity Logo" className="logo-img" />
                        <div className="logo-text">The Vanity</div>
                    </Link>

                    <div className="mobile-header-icons">
                        <Link to={isAuthenticated ? "/profile" : "/login"} className="mobile-icon-link">
                            <FaUser />
                        </Link>
                        <Link to="/bag" className="mobile-icon-link" style={{ position: 'relative' }}>
                            <FaShoppingBag />
                            {cartCount > 0 && (
                                <span className="mobile-bag-count">{cartCount}</span>
                            )}
                        </Link>
                    </div>
                </div>

                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search The Vanity"
                        value={query}
                        onChange={handleSearchChange}
                    />
                    <button className="mobile-search-btn">
                        <FaSearch />
                    </button>

                    {/* Search Suggestions Dropdown */}
                    {(suggestions.length > 0 || didYouMean) && (
                        <div className="search-suggestions">
                            {suggestions.map(product => (
                                <div
                                    key={product.id}
                                    className="suggestion-item"
                                    onClick={() => handleSuggestionClick(product.id)}
                                >
                                    <img src={product.image} alt={product.name} />
                                    <div className="suggestion-details">
                                        <span className="suggestion-name">{product.name}</span>
                                        <span className="suggestion-brand">{product.brand}</span>
                                    </div>
                                </div>
                            ))}

                            {suggestions.length === 0 && didYouMean && (
                                <div className="suggestion-fallback">
                                    Did you mean <span className="did-you-mean" onClick={() => handleSuggestionClick(didYouMean.id)}>{didYouMean.name}</span>?
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
