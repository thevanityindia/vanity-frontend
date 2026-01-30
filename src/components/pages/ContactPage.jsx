import React, { useState } from 'react';
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import './ContactPage.css';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        category: 'general'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            toast.success('Message sent successfully! We\'ll get back to you soon.');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
                category: 'general'
            });
        } catch (error) {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="contact-page">
            <div className="contact-container">
                <div className="contact-header">
                    <h1>Contact Us</h1>
                    <p className="page-subtitle">We're here to help! Get in touch with us</p>
                </div>

                <div className="contact-content">
                    <div className="contact-grid">
                        <div className="contact-info-section">
                            <h2>Get In Touch</h2>
                            <p>
                                Have questions, feedback, or need assistance? We'd love to hear from you.
                                Our customer service team is dedicated to providing you with the best support.
                            </p>

                            <div className="contact-methods">
                                <div className="contact-method">
                                    <div className="contact-icon">
                                        <FiPhone />
                                    </div>
                                    <div className="contact-details">
                                        <h3>Phone Support</h3>
                                        <p><strong>+91 9112233165</strong></p>
                                        <p><strong>+91 9112233158</strong></p>
                                        <p>Mon-Sat: 10:00 AM - 7:00 PM</p>
                                    </div>
                                </div>

                                <div className="contact-method">
                                    <div className="contact-icon">
                                        <FiMail />
                                    </div>
                                    <div className="contact-details">
                                        <h3>Email Support</h3>
                                        <p><strong>support@thevanityindia.com</strong></p>
                                        <p>General inquiries and support</p>
                                        <p>Response within 24 hours</p>
                                    </div>
                                </div>

                                <div className="contact-method">
                                    <div className="contact-icon">
                                        <FiMapPin />
                                    </div>
                                    <div className="contact-details">
                                        <h3>Head Office</h3>
                                        <p><strong>The Vanity India</strong></p>
                                        <p>Office no 120, 1st Floor, Hilton Arcade</p>
                                        <p>Opp-Tanish NX Salon, Evershine</p>
                                        <p>Vasai East - 401208</p>
                                    </div>
                                </div>

                                <div className="contact-method">
                                    <div className="contact-icon">
                                        <FiClock />
                                    </div>
                                    <div className="contact-details">
                                        <h3>Business Hours</h3>
                                        <p><strong>Monday - Saturday</strong></p>
                                        <p>9:00 AM - 9:00 PM</p>
                                        <p><strong>Sunday:</strong> 10:00 AM - 6:00 PM</p>
                                    </div>
                                </div>
                            </div>

                            <div className="social-contact">
                                <h3>Follow Us</h3>
                                <div className="social-links">
                                    <a href="#" className="social-link facebook">
                                        <FaFacebookF />
                                        <span>Facebook</span>
                                    </a>
                                    <a href="https://www.instagram.com/thevanity_official?igsh=NDkzMWlxczFpOTJ2" target="_blank" rel="noopener noreferrer" className="social-link instagram">
                                        <FaInstagram />
                                        <span>Instagram</span>
                                    </a>
                                    <a href="#" className="social-link twitter">
                                        <FaTwitter />
                                        <span>Twitter</span>
                                    </a>
                                    <a href="#" className="social-link youtube">
                                        <FaYoutube />
                                        <span>YouTube</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="contact-form-section">
                            <h2>Send Us a Message</h2>
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="name">Full Name *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email Address *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="phone">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="category">Category</label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                        >
                                            <option value="general">General Inquiry</option>
                                            <option value="order">Order Support</option>
                                            <option value="product">Product Question</option>
                                            <option value="return">Returns & Exchanges</option>
                                            <option value="technical">Technical Issue</option>
                                            <option value="partnership">Business Partnership</option>
                                            <option value="feedback">Feedback & Suggestions</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject">Subject *</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Brief description of your inquiry"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">Message *</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows="6"
                                        placeholder="Please provide details about your inquiry..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner"></span>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <FiSend />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    <section className="content-section">
                        <h2>Other Ways to Reach Us</h2>
                        <div className="additional-contact">
                            <div className="contact-card">
                                <h3>💬 Live Chat</h3>
                                <p>Get instant help with our live chat feature available 24/7 on our website.</p>
                            </div>
                            <div className="contact-card">
                                <h3>📱 WhatsApp</h3>
                                <p>Message us on WhatsApp at +91 9112233165 for quick support.</p>
                            </div>
                            <div className="contact-card">
                                <h3>🏪 Visit Our Stores</h3>
                                <p>Find a store near you for in-person beauty consultations and product trials.</p>
                            </div>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Frequently Asked Questions</h2>
                        <p>
                            Before reaching out, you might find your answer in our comprehensive FAQ section.
                            We've compiled answers to the most common questions about orders, shipping, returns,
                            and product information.
                        </p>
                        <a href="/faq" className="cta-link">View FAQ →</a>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;