import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { toast } from 'react-hot-toast';
import { FiEye, FiEyeOff, FiShield, FiLock, FiMail } from 'react-icons/fi';
import './AdminLogin.css';

const AdminLogin = () => {
    // We'll use 'email' for real backend login, though UI label says "Email"
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);
    const { adminLogin, isAdminAuthenticated } = useAdminAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAdminAuthenticated) {
            const from = location.state?.from?.pathname || '/admin/dashboard';
            navigate(from, { replace: true });
        }
    }, [isAdminAuthenticated, navigate, location]);

    // Handle login attempt blocking logic (Client side safety, backend also has rate limits)
    useEffect(() => {
        const storedAttempts = localStorage.getItem('adminLoginAttempts');
        const storedBlockTime = localStorage.getItem('adminBlockTime');

        if (storedAttempts) {
            setLoginAttempts(parseInt(storedAttempts));
        }

        if (storedBlockTime) {
            const blockTime = new Date(storedBlockTime);
            const now = new Date();

            if (now < blockTime) {
                setIsBlocked(true);
                const remaining = Math.ceil((blockTime - now) / 1000);
                setBlockTimeRemaining(remaining);

                const timer = setInterval(() => {
                    const newRemaining = Math.ceil((blockTime - new Date()) / 1000);
                    if (newRemaining <= 0) {
                        setIsBlocked(false);
                        setBlockTimeRemaining(0);
                        setLoginAttempts(0);
                        localStorage.removeItem('adminBlockTime');
                        localStorage.removeItem('adminLoginAttempts');
                        clearInterval(timer);
                    } else {
                        setBlockTimeRemaining(newRemaining);
                    }
                }, 1000);

                return () => clearInterval(timer);
            } else {
                // Block time expired
                setIsBlocked(false);
                setLoginAttempts(0);
                localStorage.removeItem('adminBlockTime');
                localStorage.removeItem('adminLoginAttempts');
            }
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateCredentials = () => {
        if (!credentials.email.trim()) {
            toast.error('Email is required');
            return false;
        }

        if (!credentials.password) {
            toast.error('Password is required');
            return false;
        }

        return true;
    };

    const handleFailedAttempt = (message) => {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        localStorage.setItem('adminLoginAttempts', newAttempts.toString());

        if (newAttempts >= 5) {
            const blockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins block
            localStorage.setItem('adminBlockTime', blockUntil.toISOString());
            setIsBlocked(true);
            setBlockTimeRemaining(15 * 60);
            toast.error('Too many failed attempts. Account blocked for 15 minutes.');
        } else {
            toast.error(message || `Invalid credentials. ${5 - newAttempts} attempts remaining.`);
        }
    };

    const handleSuccessfulLogin = () => {
        setLoginAttempts(0);
        localStorage.removeItem('adminLoginAttempts');
        localStorage.removeItem('adminBlockTime');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isBlocked) {
            toast.error(`Account is blocked. Try again in ${Math.ceil(blockTimeRemaining / 60)} minutes.`);
            return;
        }

        if (!validateCredentials()) {
            return;
        }

        setLoading(true);

        try {
            const result = await adminLogin(credentials);

            if (result.success) {
                handleSuccessfulLogin();
                toast.success('Admin login successful');
                const from = location.state?.from?.pathname || '/admin/dashboard';
                navigate(from, { replace: true });
            } else {
                handleFailedAttempt(result.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('An error occurred during login');
            handleFailedAttempt();
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <div className="login-icon">
                        <FiShield />
                    </div>
                    <h1>Admin Access</h1>
                    <p>The Vanity Management Portal</p>
                    <div className="security-badge">
                        <FiLock />
                        <span>Encrypted Connection</span>
                    </div>
                </div>

                {isBlocked ? (
                    <div className="blocked-message">
                        <div className="blocked-icon">
                            <FiLock />
                        </div>
                        <h3>Security Lockout</h3>
                        <p>Too many failed login attempts.</p>
                        <p>Try again in: <strong>{formatTime(blockTimeRemaining)}</strong></p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="admin-login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-group">
                                <FiMail className="input-icon" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={credentials.email}
                                    onChange={handleInputChange}
                                    placeholder="admin@thevanity.com"
                                    required
                                    autoComplete="email"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-input-container">
                                <FiLock className="input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={credentials.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter secure password"
                                    required
                                    autoComplete="current-password"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        {loginAttempts > 0 && (
                            <div className="login-attempts-warning">
                                <span>Failed attempts: {loginAttempts}/5</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="admin-login-btn"
                            disabled={loading || isBlocked}
                        >
                            {loading ? <span className="spinner"></span> : 'Secure Sign In'}
                        </button>
                    </form>
                )}

                <div className="admin-login-footer">
                    <p>Authorized Personnel Only</p>
                    <div className="security-info">
                        <small>
                            • Systems are monitored 24/7<br />
                            • Unauthorized access is prohibited<br />
                            • Contact Support for lost access
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;