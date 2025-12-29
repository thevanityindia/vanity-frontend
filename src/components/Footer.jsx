import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaCcVisa, FaCcMastercard, FaCcAmex, FaCreditCard } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-column">
                    <h4>ABOUT US</h4>
                    <ul>
                        <li><Link to="/about">About The Vanity India</Link></li>
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                        <li><Link to="/terms">Terms of Use</Link></li>
                        <li><Link to="/sitemap">Sitemap</Link></li>
                        <li><Link to="/international">International</Link></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>CUSTOMER CARE</h4>
                    <ul>
                        <li><Link to="/faq">FAQ</Link></li>
                        <li><Link to="/delivery">Delivery</Link></li>
                        <li><Link to="/stores">Find a Store</Link></li>
                        <li><Link to="/services">Beauty Services</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                    </ul>
                </div>
                <div className="footer-column connect-column">
                    <h4>CONNECT WITH US</h4>
                    <div className="social-icons">
                        <div className="social-icon"><FaFacebookF /></div>
                        <div className="social-icon"><FaInstagram /></div>
                        <div className="social-icon"><FaTwitter /></div>
                        <div className="social-icon"><FaYoutube /></div>
                    </div>
                    <h4 className="payment-title">PAYMENT OPTIONS</h4>
                    <div className="payment-icons">
                        <FaCcVisa title="Visa" />
                        <FaCcMastercard title="Mastercard" />
                        <span className="payment-text">RuPay</span>
                        <FaCcAmex title="Amex" />
                        <span className="payment-text">UPI</span>
                        <FaCreditCard title="Net Banking" />
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                &copy; 2025 The Vanity India. All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;
