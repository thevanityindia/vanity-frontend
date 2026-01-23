import React from 'react';
import { Link } from 'react-router-dom';
import './InfoPages.css';

const SitemapPage = () => {
    const sitemapData = [
        {
            category: "Main Pages",
            links: [
                { name: "Home", url: "/" },
                { name: "New Arrivals", url: "/new" },
                { name: "Brands", url: "/brands" },
                { name: "Login / Register", url: "/login" },
                { name: "Wishlist", url: "/wishlist" },
                { name: "Shopping Bag", url: "/bag" }
            ]
        },
        {
            category: "Product Categories",
            links: [
                { name: "Makeup", url: "/makeup" },
                { name: "Skincare", url: "/skincare" },
                { name: "Hair Care", url: "/hair" },
                { name: "Fragrance", url: "/fragrance" },
                { name: "Bath & Body", url: "/bath-body" },
                { name: "Artificial Jewellery", url: "/artificial-jewellery" }
            ]
        },
        {
            category: "Customer Service",
            links: [
                { name: "Contact Us", url: "/contact" },
                { name: "FAQ", url: "/faq" },
                { name: "Shipping & Delivery", url: "/delivery" },
                { name: "Find a Store", url: "/stores" },
                { name: "Beauty Services", url: "/services" },
                { name: "Stores & Events", url: "/stores-events" }
            ]
        },
        {
            category: "Company Information",
            links: [
                { name: "About The Vanity India", url: "/about" },
                { name: "Privacy Policy", url: "/privacy" },
                { name: "Terms of Use", url: "/terms" },
                { name: "Sitemap", url: "/sitemap" },
                { name: "International Shipping", url: "/international" },
                { name: "Beauty Pass Benefits", url: "/beauty-pass" }
            ]
        },
        {
            category: "Admin Panel",
            links: [
                { name: "Admin Login", url: "/admin/login" },
                { name: "Admin Dashboard", url: "/admin/dashboard" },
                { name: "Product Management", url: "/admin/products" },
                { name: "User Management", url: "/admin/users" },
                { name: "Order Management", url: "/admin/orders" },
                { name: "Analytics", url: "/admin/analytics" },
                { name: "Category Management", url: "/admin/categories" },
                { name: "Inventory Management", url: "/admin/inventory" },
                { name: "Content Management", url: "/admin/content" },
                { name: "Settings", url: "/admin/settings" },
                { name: "Notifications", url: "/admin/notifications" }
            ]
        }
    ];

    return (
        <div className="info-page">
            <div className="info-container">
                <div className="page-header">
                    <h1>Sitemap</h1>
                    <p className="page-subtitle">Complete navigation guide to The Vanity India website</p>
                </div>
                
                <div className="info-content">
                    <section className="content-section">
                        <p>
                            This sitemap provides a comprehensive overview of all pages and sections available 
                            on The Vanity India website. Use this guide to quickly navigate to any page or 
                            find specific information you're looking for.
                        </p>
                    </section>

                    <div className="sitemap-grid">
                        {sitemapData.map((section, index) => (
                            <div key={index} className="sitemap-section">
                                <h2 className="sitemap-category">{section.category}</h2>
                                <ul className="sitemap-links">
                                    {section.links.map((link, linkIndex) => (
                                        <li key={linkIndex}>
                                            <Link to={link.url} className="sitemap-link">
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <section className="content-section">
                        <h2>Popular Product Categories</h2>
                        <div className="popular-categories">
                            <div className="category-group">
                                <h3>Makeup</h3>
                                <ul>
                                    <li>Foundation & Concealer</li>
                                    <li>Lipstick & Lip Care</li>
                                    <li>Eye Makeup</li>
                                    <li>Face Makeup</li>
                                    <li>Makeup Tools & Brushes</li>
                                </ul>
                            </div>
                            
                            <div className="category-group">
                                <h3>Skincare</h3>
                                <ul>
                                    <li>Cleansers & Toners</li>
                                    <li>Moisturizers & Serums</li>
                                    <li>Sunscreen & SPF</li>
                                    <li>Face Masks & Treatments</li>
                                    <li>Anti-Aging Products</li>
                                </ul>
                            </div>
                            
                            <div className="category-group">
                                <h3>Hair Care</h3>
                                <ul>
                                    <li>Shampoo & Conditioner</li>
                                    <li>Hair Styling Products</li>
                                    <li>Hair Treatments</li>
                                    <li>Hair Tools & Accessories</li>
                                    <li>Hair Color & Dye</li>
                                </ul>
                            </div>
                            
                            <div className="category-group">
                                <h3>Fragrance</h3>
                                <ul>
                                    <li>Perfumes for Women</li>
                                    <li>Perfumes for Men</li>
                                    <li>Body Sprays & Mists</li>
                                    <li>Deodorants</li>
                                    <li>Gift Sets</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Quick Access</h2>
                        <div className="quick-access-grid">
                            <div className="quick-access-card">
                                <h3>🛍️ Shopping</h3>
                                <ul>
                                    <li><Link to="/new">New Arrivals</Link></li>
                                    <li><Link to="/brands">Top Brands</Link></li>
                                    <li><Link to="/wishlist">My Wishlist</Link></li>
                                    <li><Link to="/bag">Shopping Bag</Link></li>
                                </ul>
                            </div>
                            
                            <div className="quick-access-card">
                                <h3>🎯 Account</h3>
                                <ul>
                                    <li><Link to="/login">Login / Register</Link></li>
                                    <li><Link to="/beauty-pass">Beauty Pass</Link></li>
                                    <li>Order History</li>
                                    <li>Account Settings</li>
                                </ul>
                            </div>
                            
                            <div className="quick-access-card">
                                <h3>💬 Support</h3>
                                <ul>
                                    <li><Link to="/contact">Contact Us</Link></li>
                                    <li><Link to="/faq">FAQ</Link></li>
                                    <li><Link to="/delivery">Shipping Info</Link></li>
                                    <li><Link to="/stores">Store Locator</Link></li>
                                </ul>
                            </div>
                            
                            <div className="quick-access-card">
                                <h3>ℹ️ Information</h3>
                                <ul>
                                    <li><Link to="/about">About Us</Link></li>
                                    <li><Link to="/privacy">Privacy Policy</Link></li>
                                    <li><Link to="/terms">Terms of Use</Link></li>
                                    <li><Link to="/services">Beauty Services</Link></li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Search Tips</h2>
                        <div className="search-tips">
                            <div className="tip-item">
                                <h3>🔍 Product Search</h3>
                                <p>Use the search bar to find specific products, brands, or categories quickly</p>
                            </div>
                            <div className="tip-item">
                                <h3>🏷️ Filter Options</h3>
                                <p>Use filters on category pages to narrow down products by price, brand, or features</p>
                            </div>
                            <div className="tip-item">
                                <h3>📱 Mobile Navigation</h3>
                                <p>On mobile devices, use the hamburger menu to access all main navigation options</p>
                            </div>
                            <div className="tip-item">
                                <h3>🔗 Breadcrumbs</h3>
                                <p>Follow breadcrumb navigation to understand your current location on the site</p>
                            </div>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Need Help Finding Something?</h2>
                        <p>
                            If you can't find what you're looking for in this sitemap, our customer service 
                            team is here to help you navigate our website and find the information or products you need.
                        </p>
                        <div className="help-options">
                            <div className="help-option">
                                <strong>📞 Call Us:</strong> +91-1800-123-4567
                            </div>
                            <div className="help-option">
                                <strong>💬 Live Chat:</strong> Available 24/7 on our website
                            </div>
                            <div className="help-option">
                                <strong>✉️ Email:</strong> support@thevanityindia.com
                            </div>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Website Updates</h2>
                        <p>
                            This sitemap is regularly updated to reflect new pages, features, and sections 
                            added to The Vanity India website. Last updated: January 2025
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default SitemapPage;