import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaCheck } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './LoginRegister.css';

const LoginRegister = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: OTP
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' }); // type: 'error' or 'success'
    const navigate = useNavigate();
    const { sendOtp, verifyOtp } = useAuth();

    const handleGetOtp = async () => {
        if (!email) {
            setMessage({ text: "Please enter your email", type: "error" });
            return;
        }
        setLoading(true);
        setMessage({ text: '', type: '' });

        const result = await sendOtp(email);
        setLoading(false);

        if (result.success) {
            setStep(2);
            setMessage({ text: `OTP sent to your email!`, type: "success" });
        } else {
            setMessage({ text: result.message || "Failed to send OTP", type: "error" });
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            setMessage({ text: "Please enter the OTP", type: "error" });
            return;
        }
        setLoading(true);
        setMessage({ text: '', type: '' });

        const result = await verifyOtp(email, otp);
        setLoading(false);

        if (result.success) {
            setMessage({ text: "Login Successful!", type: "success" });
            setTimeout(() => {
                navigate('/');
            }, 500);
        } else {
            setMessage({ text: result.message || "Invalid OTP", type: "error" });
        }
    };

    return (
        <div className="auth-page-overlay">
            <div className="auth-card">
                <button className="close-btn" onClick={() => navigate('/')}><FaTimes /></button>

                <div className="auth-header-section">
                    <h2 className="auth-brand">THE VANITY</h2>
                    <p className="auth-subtitle">Explore endless beauty from the world's most desired beauty brands</p>
                </div>

                <div className="auth-benefits">
                    <div className="benefit-item">
                        <FaCheck className="check-icon" /> <span>Free Shipping on orders above Rs. 999</span>
                    </div>
                    <div className="benefit-item">
                        <FaCheck className="check-icon" /> <span>Exclusive Brands & Offers</span>
                    </div>
                    <div className="benefit-item">
                        <FaCheck className="check-icon" /> <span>Free samples with every purchase</span>
                    </div>
                </div>

                <div className="auth-login-section">
                    <h3>{step === 1 ? 'The Vanity India' : 'Verify OTP'}</h3>
                    <p>{step === 1 ? 'Please validate your email to proceed' : `Enter the OTP sent to ${email}`}</p>

                    {step === 1 ? (
                        <>
                            <div className="input-group">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="terms-checkbox">
                                <input type="checkbox" id="terms" />
                                <label htmlFor="terms">
                                    I agree to the <a href="#">Terms of Service</a>, <a href="#">Privacy Policy</a>, and accept enrollment to Beauty Pass Loyalty Programme on my first purchase
                                </label>
                            </div>

                            {message.text && (
                                <div style={{
                                    marginBottom: '1rem',
                                    color: message.type === 'error' ? 'red' : 'green',
                                    fontSize: '0.9rem'
                                }}>
                                    {message.text}
                                </div>
                            )}

                            <button className="get-otp-btn" onClick={handleGetOtp} disabled={loading}>
                                {loading ? 'SENDING...' : 'GET OTP'}
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="input-group">
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength={6}
                                />
                            </div>
                            <div className="terms-checkbox">
                                <span className="resend-link" onClick={() => setStep(1)} style={{ cursor: 'pointer', color: '#666' }}>
                                    Change Email / Resend
                                </span>
                            </div>

                            {message.text && (
                                <div style={{
                                    marginBottom: '1rem',
                                    color: message.type === 'error' ? 'red' : 'green',
                                    fontSize: '0.9rem'
                                }}>
                                    {message.text}
                                </div>
                            )}

                            <button className="get-otp-btn" onClick={handleVerifyOtp} disabled={loading}>
                                {loading ? 'VERIFYING...' : 'SUBMIT'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginRegister;
