import React from 'react';
import { FiStar, FiClock, FiUsers, FiAward } from 'react-icons/fi';
import './InfoPages.css';

const ServicesPage = () => {
    const services = [
        {
            id: 1,
            name: "Personal Beauty Consultation",
            duration: "45 minutes",
            price: "Free",
            description: "One-on-one consultation with our beauty experts to understand your skin type, concerns, and create a personalized beauty routine.",
            includes: [
                "Detailed skin analysis",
                "Product recommendations",
                "Skincare routine planning",
                "Color matching for makeup",
                "Take-home sample kit"
            ],
            image: "consultation"
        },
        {
            id: 2,
            name: "Professional Makeup Application",
            duration: "60 minutes",
            price: "₹1,999",
            description: "Get your makeup done by professional makeup artists for special occasions, events, or just to treat yourself.",
            includes: [
                "Complete makeup application",
                "Skin preparation and priming",
                "Color coordination",
                "Setting and finishing",
                "Touch-up kit provided"
            ],
            image: "makeup"
        },
        {
            id: 3,
            name: "Bridal Makeup Trial",
            duration: "90 minutes",
            price: "₹2,999",
            description: "Perfect your bridal look with our comprehensive makeup trial service, ensuring you look stunning on your special day.",
            includes: [
                "Complete bridal makeup trial",
                "Hair styling consultation",
                "Photography for reference",
                "Product list for touch-ups",
                "Booking for wedding day"
            ],
            image: "bridal"
        },
        {
            id: 4,
            name: "Skin Analysis & Treatment Plan",
            duration: "30 minutes",
            price: "₹499",
            description: "Advanced digital skin analysis using professional equipment to create a customized skincare treatment plan.",
            includes: [
                "Digital skin scanning",
                "Detailed skin report",
                "Treatment recommendations",
                "Product suggestions",
                "Follow-up consultation"
            ],
            image: "analysis"
        },
        {
            id: 5,
            name: "Makeup Masterclass",
            duration: "2 hours",
            price: "₹3,999",
            description: "Learn professional makeup techniques in our hands-on masterclass suitable for beginners and enthusiasts.",
            includes: [
                "Basic to advanced techniques",
                "Product knowledge",
                "Hands-on practice",
                "Take-home makeup kit",
                "Certificate of completion"
            ],
            image: "masterclass"
        },
        {
            id: 6,
            name: "Personal Shopping Experience",
            duration: "60 minutes",
            price: "Free with purchase",
            description: "Enjoy a curated shopping experience with our beauty experts who will help you find the perfect products.",
            includes: [
                "Personalized product selection",
                "Try before you buy",
                "Expert recommendations",
                "Exclusive member discounts",
                "Gift wrapping service"
            ],
            image: "shopping"
        }
    ];

    return (
        <div className="info-page">
            <div className="info-container">
                <div className="page-header">
                    <h1>Beauty Services</h1>
                    <p className="page-subtitle">Professional beauty services by certified experts</p>
                </div>
                
                <div className="info-content">
                    <section className="content-section">
                        <h2>Our Services</h2>
                        <div className="services-grid">
                            {services.map(service => (
                                <div key={service.id} className="service-card">
                                    <div className="service-header">
                                        <h3>{service.name}</h3>
                                        <div className="service-meta">
                                            <span className="duration">
                                                <FiClock /> {service.duration}
                                            </span>
                                            <span className="price">{service.price}</span>
                                        </div>
                                    </div>
                                    
                                    <p className="service-description">{service.description}</p>
                                    
                                    <div className="service-includes">
                                        <h4>What's Included:</h4>
                                        <ul>
                                            {service.includes.map((item, index) => (
                                                <li key={index}>✓ {item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <button className="book-service-btn">Book Now</button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Why Choose Our Services?</h2>
                        <div className="features-grid">
                            <div className="feature-card">
                                <FiAward className="feature-icon" />
                                <h3>Certified Professionals</h3>
                                <p>Our beauty experts are certified and trained in the latest techniques and trends</p>
                            </div>
                            <div className="feature-card">
                                <FiStar className="feature-icon" />
                                <h3>Premium Products</h3>
                                <p>We use only authentic, high-quality products from renowned international brands</p>
                            </div>
                            <div className="feature-card">
                                <FiUsers className="feature-icon" />
                                <h3>Personalized Approach</h3>
                                <p>Every service is tailored to your unique needs, preferences, and skin type</p>
                            </div>
                            <div className="feature-card">
                                <FiClock className="feature-icon" />
                                <h3>Flexible Scheduling</h3>
                                <p>Book appointments at your convenience with our flexible scheduling options</p>
                            </div>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Service Packages</h2>
                        <div className="packages-grid">
                            <div className="package-card">
                                <h3>Bridal Beauty Package</h3>
                                <div className="package-price">₹8,999</div>
                                <div className="package-savings">Save ₹2,000</div>
                                <ul className="package-includes">
                                    <li>Bridal makeup trial</li>
                                    <li>Wedding day makeup</li>
                                    <li>Hair styling</li>
                                    <li>Pre-wedding skincare consultation</li>
                                    <li>Touch-up kit</li>
                                    <li>Photography session</li>
                                </ul>
                                <button className="package-btn">Choose Package</button>
                            </div>
                            
                            <div className="package-card popular">
                                <div className="popular-badge">Most Popular</div>
                                <h3>Complete Makeover</h3>
                                <div className="package-price">₹4,999</div>
                                <div className="package-savings">Save ₹1,500</div>
                                <ul className="package-includes">
                                    <li>Skin analysis</li>
                                    <li>Personal consultation</li>
                                    <li>Professional makeup</li>
                                    <li>Personal shopping session</li>
                                    <li>Product recommendations</li>
                                    <li>Follow-up consultation</li>
                                </ul>
                                <button className="package-btn">Choose Package</button>
                            </div>
                            
                            <div className="package-card">
                                <h3>Beauty Basics</h3>
                                <div className="package-price">₹1,999</div>
                                <div className="package-savings">Save ₹500</div>
                                <ul className="package-includes">
                                    <li>Personal consultation</li>
                                    <li>Skin analysis</li>
                                    <li>Product recommendations</li>
                                    <li>Basic makeup tutorial</li>
                                    <li>Sample kit</li>
                                </ul>
                                <button className="package-btn">Choose Package</button>
                            </div>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>How to Book</h2>
                        <div className="booking-steps">
                            <div className="booking-step">
                                <div className="step-number">1</div>
                                <h3>Choose Your Service</h3>
                                <p>Select the service or package that best fits your needs</p>
                            </div>
                            <div className="booking-step">
                                <div className="step-number">2</div>
                                <h3>Select Date & Time</h3>
                                <p>Pick a convenient date and time slot from our available options</p>
                            </div>
                            <div className="booking-step">
                                <div className="step-number">3</div>
                                <h3>Confirm Booking</h3>
                                <p>Provide your details and confirm your appointment</p>
                            </div>
                            <div className="booking-step">
                                <div className="step-number">4</div>
                                <h3>Enjoy Your Service</h3>
                                <p>Visit our store and enjoy your personalized beauty service</p>
                            </div>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Service Policies</h2>
                        <div className="policies-grid">
                            <div className="policy-card">
                                <h3>📅 Booking & Cancellation</h3>
                                <ul>
                                    <li>Book at least 24 hours in advance</li>
                                    <li>Free cancellation up to 4 hours before appointment</li>
                                    <li>Rescheduling available subject to availability</li>
                                    <li>No-show charges may apply</li>
                                </ul>
                            </div>
                            
                            <div className="policy-card">
                                <h3>💳 Payment & Pricing</h3>
                                <ul>
                                    <li>Payment required at time of service</li>
                                    <li>All major payment methods accepted</li>
                                    <li>Package deals offer significant savings</li>
                                    <li>Member discounts available</li>
                                </ul>
                            </div>
                            
                            <div className="policy-card">
                                <h3>🛡️ Health & Safety</h3>
                                <ul>
                                    <li>All tools sanitized between clients</li>
                                    <li>Single-use products where applicable</li>
                                    <li>Patch tests available for sensitive skin</li>
                                    <li>COVID-19 safety protocols followed</li>
                                </ul>
                            </div>
                            
                            <div className="policy-card">
                                <h3>✨ Satisfaction Guarantee</h3>
                                <ul>
                                    <li>100% satisfaction guaranteed</li>
                                    <li>Complimentary touch-ups within 24 hours</li>
                                    <li>Professional advice and tips included</li>
                                    <li>Follow-up support available</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Customer Reviews</h2>
                        <div className="reviews-grid">
                            <div className="review-card">
                                <div className="review-stars">⭐⭐⭐⭐⭐</div>
                                <p>"Amazing bridal makeup service! The artist understood exactly what I wanted and made me feel like a princess on my wedding day."</p>
                                <div className="reviewer">- Priya S., Mumbai</div>
                            </div>
                            <div className="review-card">
                                <div className="review-stars">⭐⭐⭐⭐⭐</div>
                                <p>"The skin analysis was so detailed and helpful. Finally found products that work perfectly for my sensitive skin."</p>
                                <div className="reviewer">- Anita K., Delhi</div>
                            </div>
                            <div className="review-card">
                                <div className="review-stars">⭐⭐⭐⭐⭐</div>
                                <p>"Loved the makeup masterclass! Learned so many professional techniques. The instructor was patient and knowledgeable."</p>
                                <div className="reviewer">- Sneha R., Bangalore</div>
                            </div>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Book Your Service Today</h2>
                        <p>
                            Ready to experience our professional beauty services? Book your appointment today 
                            and let our experts help you look and feel your best.
                        </p>
                        <div className="booking-contact">
                            <div className="contact-method">
                                <h3>📞 Call to Book</h3>
                                <p>+91-1800-123-4567</p>
                                <p>Mon-Sat: 9 AM - 9 PM</p>
                            </div>
                            <div className="contact-method">
                                <h3>💬 Online Chat</h3>
                                <p>Available 24/7</p>
                                <p>Instant booking confirmation</p>
                            </div>
                            <div className="contact-method">
                                <h3>🏪 Visit Store</h3>
                                <p>Walk-ins welcome</p>
                                <p>Subject to availability</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;