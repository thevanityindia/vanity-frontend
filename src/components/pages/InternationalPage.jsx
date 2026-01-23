import React from 'react';
import { FiGlobe, FiTruck, FiDollarSign, FiShield } from 'react-icons/fi';
import './InfoPages.css';

const InternationalPage = () => {
    return (
        <div className="info-page">
            <div className="info-container">
                <div className="page-header">
                    <h1>International Shipping</h1>
                    <p className="page-subtitle">Bringing Indian beauty to the world</p>
                </div>
                
                <div className="info-content">
                    <section className="content-section">
                        <div className="announcement-banner">
                            <h2>🚀 Coming Soon: Global Delivery</h2>
                            <p>
                                We're excited to announce that international shipping will be available soon! 
                                The Vanity India is expanding globally to bring authentic Indian beauty products 
                                to customers worldwide.
                            </p>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Planned International Services</h2>
                        <div className="services-grid">
                            <div className="service-card">
                                <FiGlobe className="service-icon" />
                                <h3>Global Reach</h3>
                                <p>Shipping to 50+ countries across North America, Europe, Asia, and Australia</p>
                            </div>
                            <div className="service-card">
                                <FiTruck className="service-icon" />
                                <h3>Express Delivery</h3>
                                <p>Fast international shipping with tracking and insurance included</p>
                            </div>
                            <div className="service-card">
                                <FiDollarSign className="service-icon" />
                                <h3>Competitive Rates</h3>
                                <p>Affordable international shipping rates with bulk order discounts</p>
                            </div>
                            <div className="service-card">
                                <FiShield className="service-icon" />
                                <h3>Secure Packaging</h3>
                                <p>Special packaging for international transit to ensure product safety</p>
                            </div>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Target Countries & Regions</h2>
                        <div className="regions-grid">
                            <div className="region-card">
                                <h3>🇺🇸 North America</h3>
                                <ul>
                                    <li>United States</li>
                                    <li>Canada</li>
                                    <li>Mexico</li>
                                </ul>
                                <p className="eta">Expected Launch: Q2 2025</p>
                            </div>
                            
                            <div className="region-card">
                                <h3>🇬🇧 Europe</h3>
                                <ul>
                                    <li>United Kingdom</li>
                                    <li>Germany</li>
                                    <li>France</li>
                                    <li>Netherlands</li>
                                    <li>Italy</li>
                                </ul>
                                <p className="eta">Expected Launch: Q3 2025</p>
                            </div>
                            
                            <div className="region-card">
                                <h3>🇦🇺 Asia-Pacific</h3>
                                <ul>
                                    <li>Australia</li>
                                    <li>New Zealand</li>
                                    <li>Singapore</li>
                                    <li>Malaysia</li>
                                    <li>UAE</li>
                                </ul>
                                <p className="eta">Expected Launch: Q2 2025</p>
                            </div>
                            
                            <div className="region-card">
                                <h3>🌍 Other Markets</h3>
                                <ul>
                                    <li>South Africa</li>
                                    <li>Brazil</li>
                                    <li>Japan</li>
                                    <li>South Korea</li>
                                </ul>
                                <p className="eta">Expected Launch: Q4 2025</p>
                            </div>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>What to Expect</h2>
                        <div className="expectations-list">
                            <div className="expectation-item">
                                <h3>📦 Product Range</h3>
                                <p>
                                    Our full catalog of authentic Indian beauty products, including traditional 
                                    Ayurvedic skincare, premium makeup brands, and exclusive Indian beauty secrets.
                                </p>
                            </div>
                            
                            <div className="expectation-item">
                                <h3>🚚 Shipping Options</h3>
                                <p>
                                    Multiple shipping speeds available - from economy (7-14 days) to express 
                                    (3-5 days) delivery options to suit your needs and budget.
                                </p>
                            </div>
                            
                            <div className="expectation-item">
                                <h3>💰 Transparent Pricing</h3>
                                <p>
                                    Clear pricing with no hidden fees. All duties, taxes, and shipping costs 
                                    will be calculated upfront at checkout.
                                </p>
                            </div>
                            
                            <div className="expectation-item">
                                <h3>🔄 Easy Returns</h3>
                                <p>
                                    International return policy with prepaid return labels for damaged or 
                                    incorrect items (terms and conditions apply).
                                </p>
                            </div>
                            
                            <div className="expectation-item">
                                <h3>💳 Local Payment</h3>
                                <p>
                                    Accept local payment methods including international credit cards, 
                                    PayPal, and region-specific payment options.
                                </p>
                            </div>
                            
                            <div className="expectation-item">
                                <h3>🌐 Multi-Language Support</h3>
                                <p>
                                    Customer service in multiple languages and localized website experience 
                                    for major international markets.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Why International Customers Love Indian Beauty</h2>
                        <div className="benefits-grid">
                            <div className="benefit-card">
                                <h3>🌿 Natural Ingredients</h3>
                                <p>Traditional Ayurvedic formulations with natural herbs and botanicals</p>
                            </div>
                            <div className="benefit-card">
                                <h3>💎 Unique Products</h3>
                                <p>Exclusive Indian beauty brands and products not available elsewhere</p>
                            </div>
                            <div className="benefit-card">
                                <h3>💰 Great Value</h3>
                                <p>High-quality products at competitive prices compared to international brands</p>
                            </div>
                            <div className="benefit-card">
                                <h3>🎨 Rich Heritage</h3>
                                <p>Beauty traditions passed down through generations, now in modern formulations</p>
                            </div>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Get Notified</h2>
                        <p>
                            Be the first to know when international shipping becomes available! 
                            Sign up for our international launch notification list.
                        </p>
                        
                        <div className="notification-signup">
                            <div className="signup-form">
                                <h3>Join Our International Waitlist</h3>
                                <form className="waitlist-form">
                                    <div className="form-row">
                                        <input 
                                            type="email" 
                                            placeholder="Enter your email address"
                                            className="email-input"
                                        />
                                        <select className="country-select">
                                            <option value="">Select your country</option>
                                            <option value="US">United States</option>
                                            <option value="CA">Canada</option>
                                            <option value="GB">United Kingdom</option>
                                            <option value="AU">Australia</option>
                                            <option value="DE">Germany</option>
                                            <option value="FR">France</option>
                                            <option value="SG">Singapore</option>
                                            <option value="AE">UAE</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="signup-btn">
                                        Notify Me When Available
                                    </button>
                                </form>
                                <p className="signup-note">
                                    We'll send you an email as soon as international shipping is available in your region.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Current Alternatives</h2>
                        <p>
                            While we prepare for international shipping, here are some current options 
                            for international customers:
                        </p>
                        
                        <div className="alternatives-list">
                            <div className="alternative-item">
                                <h3>🎁 Gift to India</h3>
                                <p>
                                    Send gifts to friends and family in India. We offer gift wrapping 
                                    and personalized messages for special occasions.
                                </p>
                            </div>
                            
                            <div className="alternative-item">
                                <h3>📧 Product Inquiries</h3>
                                <p>
                                    Contact our customer service team for specific product availability 
                                    and potential shipping arrangements for bulk orders.
                                </p>
                            </div>
                            
                            <div className="alternative-item">
                                <h3>🏪 Partner Stores</h3>
                                <p>
                                    We're working with international retailers to stock our products. 
                                    Check our partner store locator for availability in your area.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Frequently Asked Questions</h2>
                        <div className="faq-list">
                            <div className="faq-item">
                                <h3>When will international shipping be available?</h3>
                                <p>
                                    We're targeting Q2 2025 for our first international markets (US, Canada, Australia). 
                                    European markets will follow in Q3 2025.
                                </p>
                            </div>
                            
                            <div className="faq-item">
                                <h3>Will all products be available internationally?</h3>
                                <p>
                                    Most of our product catalog will be available internationally. Some products 
                                    may be restricted due to shipping regulations or ingredient restrictions in certain countries.
                                </p>
                            </div>
                            
                            <div className="faq-item">
                                <h3>How much will international shipping cost?</h3>
                                <p>
                                    Shipping costs will vary by destination and shipping speed. We're working to offer 
                                    competitive rates and free shipping thresholds for international orders.
                                </p>
                            </div>
                            
                            <div className="faq-item">
                                <h3>Will I have to pay customs duties?</h3>
                                <p>
                                    Customs duties and taxes depend on your country's import regulations. 
                                    We'll provide clear information about potential additional costs at checkout.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Stay Connected</h2>
                        <p>
                            Follow us on social media for the latest updates on our international expansion 
                            and be part of our global beauty community.
                        </p>
                        
                        <div className="social-follow">
                            <a href="#" className="social-link">📘 Facebook</a>
                            <a href="#" className="social-link">📷 Instagram</a>
                            <a href="#" className="social-link">🐦 Twitter</a>
                            <a href="#" className="social-link">📺 YouTube</a>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Contact Us</h2>
                        <p>
                            Have questions about our international expansion? We'd love to hear from you!
                        </p>
                        <div className="contact-info">
                            <p><strong>Email:</strong> international@thevanityindia.com</p>
                            <p><strong>Phone:</strong> +91-1800-123-4567</p>
                            <p><strong>Business Hours:</strong> Mon-Sat, 9 AM - 9 PM IST</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default InternationalPage;