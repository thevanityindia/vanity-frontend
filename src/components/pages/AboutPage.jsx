import React from 'react';
import './InfoPages.css';

const AboutPage = () => {
    return (
        <div className="info-page">
            <div className="info-container">
                <div className="page-header">
                    <h1>About The Vanity India</h1>
                    <p className="page-subtitle">Your Premier Destination for Beauty & Lifestyle</p>
                </div>
                
                <div className="info-content">
                    <section className="content-section">
                        <h2>Our Story</h2>
                        <p>
                            Founded with a passion for beauty and self-expression, The Vanity India has been at the forefront 
                            of bringing the latest in cosmetics, skincare, and lifestyle products to beauty enthusiasts across India. 
                            Since our inception, we have been committed to making premium beauty accessible to everyone.
                        </p>
                        <p>
                            What started as a small venture has grown into one of India's most trusted beauty destinations, 
                            serving millions of customers who trust us for authentic products, expert advice, and exceptional service.
                        </p>
                    </section>

                    <section className="content-section">
                        <h2>Our Mission</h2>
                        <p>
                            To democratize beauty by making premium cosmetics, skincare, and lifestyle products accessible 
                            to every Indian, while providing an unparalleled shopping experience that celebrates individuality 
                            and self-expression.
                        </p>
                    </section>

                    <section className="content-section">
                        <h2>What We Offer</h2>
                        <div className="features-grid">
                            <div className="feature-card">
                                <h3>🎨 Premium Makeup</h3>
                                <p>Curated collection of international and domestic makeup brands</p>
                            </div>
                            <div className="feature-card">
                                <h3>✨ Skincare Solutions</h3>
                                <p>Expert-recommended skincare products for every skin type</p>
                            </div>
                            <div className="feature-card">
                                <h3>💇‍♀️ Hair Care</h3>
                                <p>Professional hair care products and styling tools</p>
                            </div>
                            <div className="feature-card">
                                <h3>🌸 Fragrances</h3>
                                <p>Exquisite collection of perfumes and body care</p>
                            </div>
                            <div className="feature-card">
                                <h3>💎 Jewelry</h3>
                                <p>Beautiful artificial jewelry to complement your style</p>
                            </div>
                            <div className="feature-card">
                                <h3>🛍️ Lifestyle</h3>
                                <p>Bath & body products for complete wellness</p>
                            </div>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Our Values</h2>
                        <div className="values-list">
                            <div className="value-item">
                                <strong>Authenticity:</strong> We guarantee 100% authentic products from authorized distributors
                            </div>
                            <div className="value-item">
                                <strong>Quality:</strong> Every product is carefully selected and quality-tested
                            </div>
                            <div className="value-item">
                                <strong>Customer First:</strong> Your satisfaction is our top priority
                            </div>
                            <div className="value-item">
                                <strong>Innovation:</strong> We constantly evolve to bring you the latest in beauty
                            </div>
                            <div className="value-item">
                                <strong>Inclusivity:</strong> Beauty has no boundaries - we celebrate diversity
                            </div>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Why Choose The Vanity India?</h2>
                        <ul className="benefits-list">
                            <li>✓ Over 10,000+ authentic beauty products</li>
                            <li>✓ Free shipping on orders above ₹499</li>
                            <li>✓ Easy returns and exchanges</li>
                            <li>✓ Expert beauty consultations</li>
                            <li>✓ Exclusive member benefits and rewards</li>
                            <li>✓ Same-day delivery in select cities</li>
                            <li>✓ 24/7 customer support</li>
                        </ul>
                    </section>

                    <section className="content-section">
                        <h2>Our Commitment</h2>
                        <p>
                            At The Vanity India, we believe that beauty is not just about looking good - it's about feeling 
                            confident, expressing your unique personality, and embracing your authentic self. We are committed 
                            to supporting your beauty journey with genuine products, expert guidance, and exceptional service.
                        </p>
                        <p>
                            Join millions of satisfied customers who have made The Vanity India their trusted beauty partner. 
                            Discover your perfect look, explore new trends, and celebrate your unique beauty with us.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;