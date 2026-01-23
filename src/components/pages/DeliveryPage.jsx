import React from 'react';
import { FiTruck, FiClock, FiMapPin, FiPackage, FiShield } from 'react-icons/fi';
import './InfoPages.css';

const DeliveryPage = () => {
    return (
        <div className="info-page">
            <div className="info-container">
                <div className="page-header">
                    <h1>Shipping & Delivery</h1>
                    <p className="page-subtitle">Fast, reliable delivery across India</p>
                </div>
                
                <div className="info-content">
                    <section className="content-section">
                        <h2>Delivery Options</h2>
                        <div className="delivery-options">
                            <div className="delivery-card">
                                <div className="delivery-icon">
                                    <FiTruck />
                                </div>
                                <h3>Standard Delivery</h3>
                                <p className="delivery-time">3-7 Business Days</p>
                                <p>Free on orders above ₹499</p>
                                <p>₹99 for orders below ₹499</p>
                            </div>
                            <div className="delivery-card">
                                <div className="delivery-icon">
                                    <FiClock />
                                </div>
                                <h3>Express Delivery</h3>
                                <p className="delivery-time">1-2 Business Days</p>
                                <p>Available in select cities</p>
                                <p>₹199 delivery charge</p>
                            </div>
                            <div className="delivery-card">
                                <div className="delivery-icon">
                                    <FiMapPin />
                                </div>
                                <h3>Same Day Delivery</h3>
                                <p className="delivery-time">Within 24 Hours</p>
                                <p>Mumbai, Delhi, Bangalore</p>
                                <p>₹299 delivery charge</p>
                            </div>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Delivery Coverage</h2>
                        <div className="coverage-info">
                            <div className="coverage-item">
                                <h3>🏙️ Metro Cities</h3>
                                <p>Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad</p>
                                <p><strong>Delivery Time:</strong> 1-3 business days</p>
                            </div>
                            <div className="coverage-item">
                                <h3>🏘️ Tier 2 Cities</h3>
                                <p>Jaipur, Lucknow, Kanpur, Nagpur, Indore, Bhopal, Visakhapatnam, Patna</p>
                                <p><strong>Delivery Time:</strong> 3-5 business days</p>
                            </div>
                            <div className="coverage-item">
                                <h3>🏞️ Other Locations</h3>
                                <p>All other serviceable PIN codes across India</p>
                                <p><strong>Delivery Time:</strong> 5-7 business days</p>
                            </div>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Order Processing</h2>
                        <div className="process-timeline">
                            <div className="timeline-item">
                                <div className="timeline-icon">1</div>
                                <div className="timeline-content">
                                    <h3>Order Confirmation</h3>
                                    <p>Your order is confirmed and payment is processed</p>
                                    <span className="timeline-time">Immediate</span>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-icon">2</div>
                                <div className="timeline-content">
                                    <h3>Processing</h3>
                                    <p>Items are picked, packed, and prepared for shipment</p>
                                    <span className="timeline-time">1-2 business days</span>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-icon">3</div>
                                <div className="timeline-content">
                                    <h3>Shipped</h3>
                                    <p>Order is dispatched and tracking information is sent</p>
                                    <span className="timeline-time">Within 24 hours</span>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-icon">4</div>
                                <div className="timeline-content">
                                    <h3>Delivered</h3>
                                    <p>Package arrives at your doorstep</p>
                                    <span className="timeline-time">As per delivery option</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Tracking Your Order</h2>
                        <div className="tracking-info">
                            <div className="tracking-step">
                                <h3>📧 Email & SMS Updates</h3>
                                <p>Receive real-time updates about your order status via email and SMS</p>
                            </div>
                            <div className="tracking-step">
                                <h3>🔍 Online Tracking</h3>
                                <p>Track your order on our website using your order number</p>
                            </div>
                            <div className="tracking-step">
                                <h3>📱 Mobile App</h3>
                                <p>Get push notifications and track orders on our mobile app</p>
                            </div>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Delivery Partners</h2>
                        <p>We work with trusted logistics partners to ensure safe and timely delivery:</p>
                        <div className="partners-list">
                            <div className="partner">Blue Dart</div>
                            <div className="partner">FedEx</div>
                            <div className="partner">Delhivery</div>
                            <div className="partner">Ekart</div>
                            <div className="partner">DTDC</div>
                            <div className="partner">India Post</div>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Special Delivery Instructions</h2>
                        <div className="special-instructions">
                            <div className="instruction-item">
                                <FiPackage className="instruction-icon" />
                                <div>
                                    <h3>Fragile Items</h3>
                                    <p>Cosmetics and fragile items are packed with extra care and bubble wrap</p>
                                </div>
                            </div>
                            <div className="instruction-item">
                                <FiShield className="instruction-icon" />
                                <div>
                                    <h3>Signature Required</h3>
                                    <p>High-value orders (above ₹5,000) require signature confirmation</p>
                                </div>
                            </div>
                            <div className="instruction-item">
                                <FiClock className="instruction-icon" />
                                <div>
                                    <h3>Delivery Attempts</h3>
                                    <p>Up to 3 delivery attempts will be made before returning to warehouse</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Delivery Charges</h2>
                        <div className="charges-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Order Value</th>
                                        <th>Standard Delivery</th>
                                        <th>Express Delivery</th>
                                        <th>Same Day Delivery</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Below ₹499</td>
                                        <td>₹99</td>
                                        <td>₹299</td>
                                        <td>₹499</td>
                                    </tr>
                                    <tr>
                                        <td>₹499 - ₹999</td>
                                        <td>Free</td>
                                        <td>₹199</td>
                                        <td>₹399</td>
                                    </tr>
                                    <tr>
                                        <td>Above ₹999</td>
                                        <td>Free</td>
                                        <td>₹149</td>
                                        <td>₹299</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Important Notes</h2>
                        <ul className="important-notes">
                            <li>Delivery times are estimates and may vary due to weather, festivals, or unforeseen circumstances</li>
                            <li>Someone must be available to receive the package during delivery hours (9 AM - 7 PM)</li>
                            <li>We do not deliver to PO Box addresses</li>
                            <li>Additional charges may apply for remote or difficult-to-reach locations</li>
                            <li>Orders placed on weekends or holidays will be processed on the next business day</li>
                            <li>Delivery is not available on Sundays and national holidays</li>
                        </ul>
                    </section>

                    <section className="content-section">
                        <h2>Need Help?</h2>
                        <p>
                            If you have questions about your delivery or need to make special arrangements, 
                            our customer service team is here to help.
                        </p>
                        <div className="help-contact">
                            <div className="help-option">
                                <strong>📞 Call:</strong> +91-1800-123-4567
                            </div>
                            <div className="help-option">
                                <strong>✉️ Email:</strong> delivery@thevanityindia.com
                            </div>
                            <div className="help-option">
                                <strong>💬 Chat:</strong> Available 24/7 on our website
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default DeliveryPage;