import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import './InfoPages.css';

const FAQPage = () => {
    const [openFAQ, setOpenFAQ] = useState(null);

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    const faqData = [
        {
            category: "Orders & Shopping",
            questions: [
                {
                    question: "How do I place an order?",
                    answer: "Simply browse our products, add items to your cart, and proceed to checkout. You'll need to create an account or sign in, provide shipping information, and complete payment to place your order."
                },
                {
                    question: "Can I modify or cancel my order?",
                    answer: "You can modify or cancel your order within 1 hour of placing it. After that, orders enter processing and cannot be changed. Contact our customer service team immediately if you need to make changes."
                },
                {
                    question: "What payment methods do you accept?",
                    answer: "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, UPI, net banking, and digital wallets like Paytm, PhonePe, and Google Pay."
                },
                {
                    question: "Is it safe to shop on your website?",
                    answer: "Yes, absolutely! We use SSL encryption to protect your personal and payment information. All transactions are processed through secure payment gateways, and we never store your credit card details."
                }
            ]
        },
        {
            category: "Shipping & Delivery",
            questions: [
                {
                    question: "What are your shipping charges?",
                    answer: "We offer free shipping on orders above ₹499. For orders below ₹499, shipping charges are ₹99. Express delivery is available for ₹199 in select cities."
                },
                {
                    question: "How long does delivery take?",
                    answer: "Standard delivery takes 3-7 business days. Express delivery (available in select cities) takes 1-2 business days. Remote locations may take additional 2-3 days."
                },
                {
                    question: "Do you deliver internationally?",
                    answer: "Currently, we only deliver within India. We're working on expanding our international shipping options and will update you soon."
                },
                {
                    question: "How can I track my order?",
                    answer: "Once your order is shipped, you'll receive a tracking number via email and SMS. You can track your order on our website or the courier partner's website."
                }
            ]
        },
        {
            category: "Returns & Exchanges",
            questions: [
                {
                    question: "What is your return policy?",
                    answer: "We offer a 30-day return policy for most products. Items must be unused, in original packaging, and in sellable condition. Cosmetics and intimate items cannot be returned for hygiene reasons."
                },
                {
                    question: "How do I return a product?",
                    answer: "Log into your account, go to 'My Orders', select the item you want to return, and follow the return process. You can also contact our customer service team for assistance."
                },
                {
                    question: "When will I receive my refund?",
                    answer: "Refunds are processed within 7-10 business days after we receive and inspect the returned item. The amount will be credited to your original payment method."
                },
                {
                    question: "Can I exchange a product?",
                    answer: "Yes, you can exchange products for a different size or color (subject to availability) within 30 days. The exchange process is similar to returns."
                }
            ]
        },
        {
            category: "Products & Authenticity",
            questions: [
                {
                    question: "Are all products authentic?",
                    answer: "Yes, we guarantee 100% authentic products. We source directly from brands and authorized distributors. All products come with authenticity certificates where applicable."
                },
                {
                    question: "Do you sell expired products?",
                    answer: "No, we never sell expired products. We maintain strict inventory management and regularly check expiry dates. All products have at least 6 months of shelf life when shipped."
                },
                {
                    question: "Can I get product recommendations?",
                    answer: "Absolutely! Our beauty experts are available to help you choose the right products. You can chat with us online, call our helpline, or visit our stores for personalized consultations."
                },
                {
                    question: "Do you offer samples?",
                    answer: "Yes, we offer free samples with orders above ₹999. You can also purchase sample sizes of many products to try before buying the full size."
                }
            ]
        },
        {
            category: "Account & Membership",
            questions: [
                {
                    question: "Do I need to create an account to shop?",
                    answer: "While you can browse without an account, you'll need to create one to place orders, track purchases, and access exclusive member benefits."
                },
                {
                    question: "What are the benefits of membership?",
                    answer: "Members enjoy exclusive discounts, early access to sales, birthday rewards, loyalty points, free beauty consultations, and priority customer service."
                },
                {
                    question: "How do I reset my password?",
                    answer: "Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password."
                },
                {
                    question: "Can I delete my account?",
                    answer: "Yes, you can delete your account by contacting our customer service team. Please note that this action is irreversible and you'll lose all order history and loyalty points."
                }
            ]
        }
    ];

    return (
        <div className="info-page">
            <div className="info-container">
                <div className="page-header">
                    <h1>Frequently Asked Questions</h1>
                    <p className="page-subtitle">Find answers to common questions about shopping with The Vanity India</p>
                </div>
                
                <div className="info-content">
                    <div className="faq-search">
                        <input 
                            type="text" 
                            placeholder="Search for answers..." 
                            className="search-input"
                        />
                    </div>

                    {faqData.map((category, categoryIndex) => (
                        <section key={categoryIndex} className="faq-category">
                            <h2 className="category-title">{category.category}</h2>
                            <div className="faq-list">
                                {category.questions.map((faq, faqIndex) => {
                                    const globalIndex = categoryIndex * 100 + faqIndex;
                                    return (
                                        <div key={faqIndex} className="faq-item">
                                            <button 
                                                className={`faq-question ${openFAQ === globalIndex ? 'active' : ''}`}
                                                onClick={() => toggleFAQ(globalIndex)}
                                            >
                                                <span>{faq.question}</span>
                                                {openFAQ === globalIndex ? <FiChevronUp /> : <FiChevronDown />}
                                            </button>
                                            {openFAQ === globalIndex && (
                                                <div className="faq-answer">
                                                    <p>{faq.answer}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    ))}

                    <section className="content-section">
                        <h2>Still Have Questions?</h2>
                        <p>
                            Can't find what you're looking for? Our customer service team is here to help!
                        </p>
                        <div className="contact-options">
                            <div className="contact-option">
                                <h3>📞 Call Us</h3>
                                <p>+91-1800-123-4567</p>
                                <p>Mon-Sat: 9 AM - 9 PM</p>
                            </div>
                            <div className="contact-option">
                                <h3>💬 Live Chat</h3>
                                <p>Available 24/7</p>
                                <p>Click the chat icon</p>
                            </div>
                            <div className="contact-option">
                                <h3>✉️ Email Us</h3>
                                <p>support@thevanityindia.com</p>
                                <p>Response within 24 hours</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;