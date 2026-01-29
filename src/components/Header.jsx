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
            <div className="header-main">
                {/* Mobile Menu Trigger */}
                <div className="mobile-menu-trigger" onClick={toggleMenu}>
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </div>

                {/* Logo Section */}
                <Link to="/" className="logo-container">
                    <img src={logo} alt="The Vanity Logo" className="logo-img" />
                    <div className="logo-text">The Vanity</div>
                </Link>

                {/* Search Bar */}
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search for products..."
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

                {/* Header Actions (User, Wishlist, Bag) */}
                <div className="header-actions">
                    <div className="action-item location-link">
                        <Link to="/stores-events" className="icon-link" title="Stores & Events">
                            <FaMapMarkerAlt />
                        </Link>
                    </div>

                    <div className="action-item user-dropdown-container">
                        {!isAuthenticated ? (
                            <Link to="/login" className="icon-link">
                                <FaUser /> <span className="action-text">Login</span>
                            </Link>
                        ) : (
                            <Link to="/profile" className="icon-link">
                                <FaUser /> <span className="action-text">Hi, {user?.firstName || 'User'}</span>
                            </Link>
                        )}
                        {/* Optional: Add logout dropdown here if needed, or keep simple link */}
                    </div>

                    <div className="action-item">
                        <Link to="/wishlist" className="icon-link" title="Wishlist">
                            <div className="icon-wrapper">
                                <FaHeart />
                                {wishlistCount > 0 && <span className="badge wishlist-badge">{wishlistCount}</span>}
                            </div>
                            <span className="action-text">Wishlist</span>
                        </Link>
                    </div>

                    <div
                        className="action-item"
                        onMouseEnter={() => setIsMiniBagOpen(true)}
                        onMouseLeave={() => setIsMiniBagOpen(false)}
                    >
                        <Link to="/bag" className="icon-link" title="Bag">
                            <div className="icon-wrapper">
                                <FaShoppingBag />
                                {cartCount > 0 && <span className="badge bag-badge">{cartCount}</span>}
                            </div>
                            <span className="action-text">Bag</span>
                        </Link>
                        <MiniBag isOpen={isMiniBagOpen} onClose={() => setIsMiniBagOpen(false)} />
                    </div>
                </div>

                {/* Mobile Icons (Simplified) */}
                <div className="mobile-header-icons">
                    <Link to={isAuthenticated ? "/profile" : "/login"} className="mobile-icon-link">
                        <FaUser />
                    </Link>
                    <Link to="/bag" className="mobile-icon-link">
                        <FaShoppingBag />
                        {cartCount > 0 && <span className="mobile-bag-count">{cartCount}</span>}
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
