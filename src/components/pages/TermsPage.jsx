import React from 'react';
import './InfoPages.css';

const TermsPage = () => {
    return (
        <div className="info-page">
            <div className="info-container">
                <div className="page-header">
                    <h1>Terms of Use</h1>
                    <p className="page-subtitle">Terms and Conditions for Using The Vanity India</p>
                    <p className="last-updated">Last Updated: January 2025</p>
                </div>
                
                <div className="info-content">
                    <section className="content-section">
                        <h2>Acceptance of Terms</h2>
                        <p>
                            By accessing and using The Vanity India website and services, you accept and agree to be bound 
                            by the terms and provision of this agreement. If you do not agree to abide by the above, 
                            please do not use this service.
                        </p>
                    </section>

                    <section className="content-section">
                        <h2>Use License</h2>
                        <p>
                            Permission is granted to temporarily download one copy of the materials on The Vanity India's 
                            website for personal, non-commercial transitory viewing only. This is the grant of a license, 
                            not a transfer of title, and under this license you may not:
                        </p>
                        <ul>
                            <li>Modify or copy the materials</li>
                            <li>Use the materials for any commercial purpose or for any public display</li>
                            <li>Attempt to reverse engineer any software contained on the website</li>
                            <li>Remove any copyright or other proprietary notations from the materials</li>
                        </ul>
                    </section>

                    <section className="content-section">
                        <h2>Account Registration</h2>
                        <p>To access certain features, you must register for an account. You agree to:</p>
                        <ul>
                            <li>Provide accurate, current, and complete information</li>
                            <li>Maintain and update your information to keep it accurate</li>
                            <li>Maintain the security of your password and account</li>
                            <li>Accept responsibility for all activities under your account</li>
                            <li>Notify us immediately of any unauthorized use</li>
                        </ul>
                    </section>

                    <section className="content-section">
                        <h2>Product Information and Pricing</h2>
                        <h3>Product Descriptions</h3>
                        <ul>
                            <li>We strive to provide accurate product descriptions and images</li>
                            <li>Colors may vary due to monitor settings and lighting</li>
                            <li>We reserve the right to correct errors in product information</li>
                            <li>Product availability is subject to change without notice</li>
                        </ul>

                        <h3>Pricing</h3>
                        <ul>
                            <li>All prices are in Indian Rupees (INR) and include applicable taxes</li>
                            <li>Prices are subject to change without prior notice</li>
                            <li>We reserve the right to correct pricing errors</li>
                            <li>Promotional offers are subject to terms and conditions</li>
                        </ul>
                    </section>

                    <section className="content-section">
                        <h2>Orders and Payment</h2>
                        <h3>Order Processing</h3>
                        <ul>
                            <li>All orders are subject to acceptance and availability</li>
                            <li>We reserve the right to refuse or cancel orders</li>
                            <li>Order confirmation does not guarantee product availability</li>
                            <li>Processing times may vary based on product availability</li>
                        </ul>

                        <h3>Payment Terms</h3>
                        <ul>
                            <li>Payment is required at the time of order placement</li>
                            <li>We accept major credit cards, debit cards, and digital wallets</li>
                            <li>All transactions are processed securely</li>
                            <li>Failed payments may result in order cancellation</li>
                        </ul>
                    </section>

                    <section className="content-section">
                        <h2>Shipping and Delivery</h2>
                        <ul>
                            <li>Delivery times are estimates and not guaranteed</li>
                            <li>Risk of loss passes to you upon delivery</li>
                            <li>We are not responsible for delays caused by shipping carriers</li>
                            <li>Additional charges may apply for remote locations</li>
                            <li>Signature confirmation may be required for high-value orders</li>
                        </ul>
                    </section>

                    <section className="content-section">
                        <h2>Returns and Exchanges</h2>
                        <p>Our return policy allows for:</p>
                        <ul>
                            <li>Returns within 30 days of delivery</li>
                            <li>Products must be unused and in original packaging</li>
                            <li>Certain items (cosmetics, intimate apparel) are non-returnable</li>
                            <li>Return shipping costs may apply</li>
                            <li>Refunds processed within 7-10 business days</li>
                        </ul>
                    </section>

                    <section className="content-section">
                        <h2>Prohibited Uses</h2>
                        <p>You may not use our service:</p>
                        <ul>
                            <li>For any unlawful purpose or to solicit others to unlawful acts</li>
                            <li>To violate any international, federal, provincial, or state regulations or laws</li>
                            <li>To infringe upon or violate our intellectual property rights or the rights of others</li>
                            <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                            <li>To submit false or misleading information</li>
                            <li>To upload or transmit viruses or any other type of malicious code</li>
                        </ul>
                    </section>

                    <section className="content-section">
                        <h2>Intellectual Property</h2>
                        <p>
                            The service and its original content, features, and functionality are and will remain the 
                            exclusive property of The Vanity India and its licensors. The service is protected by 
                            copyright, trademark, and other laws. Our trademarks and trade dress may not be used 
                            in connection with any product or service without our prior written consent.
                        </p>
                    </section>

                    <section className="content-section">
                        <h2>Disclaimer</h2>
                        <p>
                            The materials on The Vanity India's website are provided on an 'as is' basis. The Vanity India 
                            makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties 
                            including without limitation, implied warranties or conditions of merchantability, fitness for 
                            a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                    </section>

                    <section className="content-section">
                        <h2>Limitations</h2>
                        <p>
                            In no event shall The Vanity India or its suppliers be liable for any damages (including, 
                            without limitation, damages for loss of data or profit, or due to business interruption) 
                            arising out of the use or inability to use the materials on The Vanity India's website, 
                            even if The Vanity India or its authorized representative has been notified orally or in 
                            writing of the possibility of such damage.
                        </p>
                    </section>

                    <section className="content-section">
                        <h2>Governing Law</h2>
                        <p>
                            These terms and conditions are governed by and construed in accordance with the laws of India 
                            and you irrevocably submit to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
                        </p>
                    </section>

                    <section className="content-section">
                        <h2>Changes to Terms</h2>
                        <p>
                            We reserve the right to revise these terms of service at any time without notice. 
                            By using this website, you are agreeing to be bound by the then current version of these terms.
                        </p>
                    </section>

                    <section className="content-section">
                        <h2>Contact Information</h2>
                        <p>If you have any questions about these Terms of Use, please contact us:</p>
                        <div className="contact-info">
                            <p><strong>Email:</strong> legal@thevanityindia.com</p>
                            <p><strong>Phone:</strong> +91-1800-123-4567</p>
                            <p><strong>Address:</strong> The Vanity India, 123 Beauty Street, Mumbai, Maharashtra 400001</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;