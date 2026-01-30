import React from 'react';
import PageToc from '../PageToc';
import StickyPageHeader from '../StickyPageHeader';
import './PrivacyPage.css'; // Import dedicated CSS

const PrivacyPage = () => {
    const tocSections = [
        { id: 'introduction', title: 'Introduction' },
        { id: 'information-collected', title: 'Information We Collect' },
        { id: 'use-of-information', title: 'How We Use Your Information' },
        { id: 'information-sharing', title: 'Information Sharing' },
        { id: 'data-security', title: 'Data Security' },
        { id: 'cookies', title: 'Cookies and Tracking' },
        { id: 'your-rights', title: 'Your Rights' },
        { id: 'data-retention', title: 'Data Retention' },
        { id: 'children-privacy', title: "Children's Privacy" },
        { id: 'changes-policy', title: 'Changes to This Policy' },
        { id: 'contact', title: 'Contact Us' }
    ];

    return (
        <div className="privacy-page-wrapper">
            <a href="#main-content" className="skip-to-content">Skip to main content</a>

            <StickyPageHeader title="Privacy Policy" />

            <div className="privacy-container">
                <div className="privacy-header">
                    <h1 className="privacy-title">Privacy Policy</h1>
                    <p className="privacy-subtitle">Your Privacy is Our Priority</p>
                    <p className="privacy-updated">Last Updated: January 2025</p>
                </div>

                <PageToc sections={tocSections} />

                <div className="privacy-content" id="main-content">
                    <section className="privacy-section" data-toc-id="introduction">
                        <h2>Introduction</h2>
                        <p>
                            At The Vanity India, we are committed to protecting your privacy and ensuring the security of your
                            personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard
                            your information when you visit our website or make a purchase from us.
                        </p>
                    </section>

                    <section className="privacy-section" data-toc-id="information-collected">
                        <h2>Information We Collect</h2>

                        <h3>Personal Information</h3>
                        <p>We may collect the following personal information:</p>
                        <ul>
                            <li>Name and contact information (email, phone number, address)</li>
                            <li>Payment information (credit card details, billing address)</li>
                            <li>Account credentials (username, password)</li>
                            <li>Purchase history and preferences</li>
                            <li>Communication preferences</li>
                        </ul>

                        <h3>Automatically Collected Information</h3>
                        <ul>
                            <li>IP address and browser information</li>
                            <li>Device information and operating system</li>
                            <li>Website usage data and analytics</li>
                            <li>Cookies and similar tracking technologies</li>
                            <li>Location data (with your consent)</li>
                        </ul>
                    </section>

                    <section className="privacy-section" data-toc-id="use-of-information">
                        <h2>How We Use Your Information</h2>
                        <p>We use your information for the following purposes:</p>
                        <ul>
                            <li>Processing and fulfilling your orders</li>
                            <li>Providing customer service and support</li>
                            <li>Personalizing your shopping experience</li>
                            <li>Sending promotional emails and offers (with consent)</li>
                            <li>Improving our website and services</li>
                            <li>Preventing fraud and ensuring security</li>
                            <li>Complying with legal obligations</li>
                        </ul>
                    </section>

                    <section className="privacy-section" data-toc-id="information-sharing">
                        <h2>Information Sharing</h2>
                        <p>We may share your information with:</p>

                        <h3>Service Providers</h3>
                        <ul>
                            <li>Payment processors for transaction processing</li>
                            <li>Shipping companies for order delivery</li>
                            <li>Marketing platforms for email campaigns</li>
                            <li>Analytics providers for website optimization</li>
                        </ul>

                        <h3>Legal Requirements</h3>
                        <p>We may disclose your information when required by law or to:</p>
                        <ul>
                            <li>Comply with legal processes or government requests</li>
                            <li>Protect our rights and property</li>
                            <li>Ensure user safety and prevent fraud</li>
                            <li>Investigate potential violations of our terms</li>
                        </ul>
                    </section>

                    <section className="privacy-section" data-toc-id="data-security">
                        <h2>Data Security</h2>
                        <p>We implement appropriate security measures to protect your information:</p>
                        <ul>
                            <li>SSL encryption for data transmission</li>
                            <li>Secure payment processing systems</li>
                            <li>Regular security audits and updates</li>
                            <li>Access controls and employee training</li>
                            <li>Data backup and recovery procedures</li>
                        </ul>
                    </section>

                    <section className="privacy-section" data-toc-id="cookies">
                        <h2>Cookies and Tracking</h2>
                        <p>We use cookies and similar technologies to:</p>
                        <ul>
                            <li>Remember your preferences and login status</li>
                            <li>Analyze website traffic and user behavior</li>
                            <li>Provide personalized content and recommendations</li>
                            <li>Enable social media features</li>
                            <li>Serve relevant advertisements</li>
                        </ul>
                        <p>You can control cookie settings through your browser preferences.</p>
                    </section>

                    <section className="privacy-section" data-toc-id="your-rights">
                        <h2>Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul>
                            <li>Access and review your personal information</li>
                            <li>Update or correct inaccurate information</li>
                            <li>Delete your account and personal data</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Request data portability</li>
                            <li>Withdraw consent for data processing</li>
                        </ul>
                    </section>

                    <section className="privacy-section" data-toc-id="data-retention">
                        <h2>Data Retention</h2>
                        <p>
                            We retain your personal information for as long as necessary to provide our services,
                            comply with legal obligations, resolve disputes, and enforce our agreements.
                            Account information is typically retained for 7 years after account closure.
                        </p>
                    </section>

                    <section className="privacy-section" data-toc-id="children-privacy">
                        <h2>Children's Privacy</h2>
                        <p>
                            Our services are not intended for children under 13 years of age. We do not knowingly
                            collect personal information from children under 13. If you believe we have collected
                            information from a child under 13, please contact us immediately.
                        </p>
                    </section>

                    <section className="privacy-section" data-toc-id="changes-policy">
                        <h2>Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of any material
                            changes by posting the new policy on our website and updating the "Last Updated" date.
                            Your continued use of our services after changes constitutes acceptance of the updated policy.
                        </p>
                    </section>

                    <section className="privacy-section" data-toc-id="contact">
                        <h2>Contact Us</h2>
                        <p>If you have questions about this Privacy Policy, please contact us:</p>
                        <div className="contact-info">
                            <p><strong>Email:</strong> privacy@thevanityindia.com</p>
                            <p><strong>Phone:</strong> +91 9112233165</p>
                            <p><strong>Address:</strong> Office no 120, 1st Floor, Hilton Arcade, Opp-Tanish NX Salon, Evershine, Vasai East - 401208</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;