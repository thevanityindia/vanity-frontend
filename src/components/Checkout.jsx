import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { INDIAN_STATES, validatePhone, fetchLocationFromPincode, getEstimatedDeliveryDate } from '../utils/locationUtils';
import API_BASE_URL from '../config';
import './Checkout.css'; // We'll create this or reuse basic styles

const Checkout = () => {
    const { isAuthenticated } = useAuth();
    const { cartItems, fetchShopData } = useShop();

    const navigate = useNavigate();
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [loading, setLoading] = useState(false);
    const [deliveryEstimate, setDeliveryEstimate] = useState('');
    const [shippingAddress, setShippingAddress] = useState({
        firstName: '',
        lastName: '',
        addressLine1: '',
        city: '',
        state: '',
        pincode: '',
        phone: ''
    });

    React.useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success && data.data.addresses) {
                    setSavedAddresses(data.data.addresses);
                    // Auto-select default if exists
                    const defaultAddr = data.data.addresses.find(a => a.isDefault);
                    if (defaultAddr) {
                        setShippingAddress({
                            firstName: defaultAddr.firstName,
                            lastName: defaultAddr.lastName,
                            addressLine1: defaultAddr.address1,
                            city: defaultAddr.city,
                            state: defaultAddr.state,
                            pincode: defaultAddr.postalCode,
                            phone: defaultAddr.phone
                        });
                        setDeliveryEstimate(getEstimatedDeliveryDate(defaultAddr.state));
                    }
                }
            } catch (err) {
                console.error("Failed to load addresses", err);
            }
        };
        if (isAuthenticated) fetchAddresses();
    }, [isAuthenticated]);

    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else if (cartItems.length === 0) {
            navigate('/');
        }
    }, [isAuthenticated, cartItems, navigate]);

    if (!isAuthenticated || cartItems.length === 0) {
        return null; // Or a loading spinner
    }

    const totalAmount = cartItems.reduce((acc, item) => {
        const price = parseFloat(item.price) || 0;
        return acc + price * item.quantity;
    }, 0);

    const handleRazorpayPayment = async (totalAmount) => {
        try {
            const token = localStorage.getItem('token');
            // 1. Create Order on Backend
            const res = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: totalAmount,
                    currency: 'INR',
                    receipt: `receipt_${Date.now()}`
                })
            });

            const orderData = await res.json();
            if (!orderData.success) throw new Error(orderData.error);

            const options = {
                key: 'rzp_test_your_id', // Replace with your actual Key ID
                amount: orderData.data.amount,
                currency: orderData.data.currency,
                name: "The Vanity",
                description: "Order Payment",
                order_id: orderData.data.id,
                handler: async function (response) {
                    // Verify payment on backend
                    const verifyRes = await fetch(`${API_BASE_URL}/api/payments/verify`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(response)
                    });

                    const verifyData = await verifyRes.json();
                    if (verifyData.success) {
                        toast.success('Payment successful!');
                        // Proceed to place order on backend with payment details
                        await submitFinalOrder({
                            method: 'online',
                            transactionId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id
                        });
                    } else {
                        toast.error('Payment verification failed');
                    }
                },
                prefill: {
                    name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
                    contact: shippingAddress.phone
                },
                theme: {
                    color: "#e60023"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                toast.error('Payment Failed: ' + response.error.description);
            });
            rzp.open();

        } catch (error) {
            console.error('Razorpay Init Error:', error);
            toast.error('Failed to initialize Razorpay. Please try again.');
        }
    };

    const submitFinalOrder = async (paymentInfo = { method: 'cod' }) => {
        setLoading(true);
        const orderItems = cartItems.map(item => ({
            productId: item.id || item._id,
            quantity: item.quantity
        }));

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: orderItems,
                    shippingAddress,
                    paymentMethod: paymentInfo.method === 'online' ? 'card' : 'cod',
                    paymentStatus: paymentInfo.method === 'online' ? 'completed' : 'pending',
                    paymentDetails: paymentInfo.transactionId ? {
                        transactionId: paymentInfo.transactionId,
                        paymentGateway: 'razorpay',
                        paidAt: new Date()
                    } : undefined
                })
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Order placed successfully!');
                await fetchShopData();
                navigate('/orders');
            } else {
                toast.error(data.error || 'Failed to place order');
            }
        } catch (error) {
            console.error('Order error:', error);
            toast.error('Network error during checkout');
        } finally {
            setLoading(false);
        }
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!validatePhone(shippingAddress.phone)) {
            toast.error('Please enter a valid 10-digit Indian phone number (starting with 6-9)');
            return;
        }

        if (paymentMethod === 'online') {
            await handleRazorpayPayment(totalAmount);
        } else {
            await submitFinalOrder({ method: 'cod' });
        }
    };

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <h1>Order Verification</h1>

                <div className="checkout-grid">
                    <div className="checkout-main-content">
                        {/* Shipping Section */}
                        <div className="checkout-section-card">
                            <h2>Shipping Details</h2>

                            {savedAddresses.length > 0 && (
                                <div className="saved-addresses-selector" style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.85rem', fontWeight: 600 }}>Use a saved address:</label>
                                    <select
                                        onChange={(e) => {
                                            const addrId = e.target.value;
                                            if (!addrId) return;
                                            const addr = savedAddresses.find(a => a._id === addrId);
                                            if (addr) {
                                                setShippingAddress({
                                                    firstName: addr.firstName,
                                                    lastName: addr.lastName,
                                                    addressLine1: addr.address1,
                                                    city: addr.city,
                                                    state: addr.state,
                                                    pincode: addr.postalCode,
                                                    phone: addr.phone
                                                });
                                                setDeliveryEstimate(getEstimatedDeliveryDate(addr.state));
                                            }
                                        }}
                                    >
                                        <option value="">-- Choose from saved addresses --</option>
                                        {savedAddresses.map(addr => (
                                            <option key={addr._id} value={addr._id}>
                                                {addr.firstName} {addr.lastName} - {addr.address1}, {addr.city}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <form id="checkout-form" onSubmit={handlePlaceOrder}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input
                                            required
                                            className="checkout-input"
                                            placeholder="e.g. Ananya"
                                            value={shippingAddress.firstName}
                                            onChange={e => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input
                                            required
                                            className="checkout-input"
                                            placeholder="e.g. Singh"
                                            value={shippingAddress.lastName}
                                            onChange={e => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Street Address</label>
                                    <input
                                        required
                                        className="checkout-input"
                                        placeholder="House No, Building, Street name"
                                        value={shippingAddress.addressLine1}
                                        onChange={e => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Pincode</label>
                                        <input
                                            required
                                            className="checkout-input"
                                            placeholder="6 Digit PIN"
                                            value={shippingAddress.pincode}
                                            onChange={async (e) => {
                                                const code = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                setShippingAddress(prev => ({ ...prev, pincode: code }));

                                                if (code.length === 6) {
                                                    const location = await fetchLocationFromPincode(code);
                                                    if (location) {
                                                        setShippingAddress(prev => ({
                                                            ...prev,
                                                            city: location.city,
                                                            state: location.state
                                                        }));
                                                        setDeliveryEstimate(getEstimatedDeliveryDate(location.state));
                                                        toast.success('Location detected!');
                                                    }
                                                }
                                            }}
                                            maxLength={6}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input
                                            required
                                            className="checkout-input"
                                            placeholder="10 Digit Mobile"
                                            value={shippingAddress.phone}
                                            onChange={e => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                setShippingAddress({ ...shippingAddress, phone: val });
                                            }}
                                            type="tel"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>City</label>
                                        <input
                                            required
                                            className="checkout-input"
                                            placeholder="City Name"
                                            value={shippingAddress.city}
                                            onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>State</label>
                                        <select
                                            required
                                            value={shippingAddress.state}
                                            onChange={e => {
                                                const newState = e.target.value;
                                                setShippingAddress({ ...shippingAddress, state: newState });
                                                if (newState) setDeliveryEstimate(getEstimatedDeliveryDate(newState));
                                            }}
                                            className="checkout-input"
                                            style={{ height: '52px' }}
                                        >
                                            <option value="">Select State</option>
                                            {INDIAN_STATES.map(state => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Payment Section */}
                        <div className="checkout-section-card">
                            <h2>Select Payment Method</h2>
                            <div className="payment-options">
                                <label className={`payment-option-card ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={() => setPaymentMethod('cod')}
                                    />
                                    <div className="payment-info">
                                        <span className="payment-label">Cash on Delivery (COD)</span>
                                        <span className="payment-desc">Pay in cash when your order is delivered.</span>
                                    </div>
                                </label>

                                <label className={`payment-option-card ${paymentMethod === 'online' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="online"
                                        checked={paymentMethod === 'online'}
                                        onChange={() => setPaymentMethod('online')}
                                    />
                                    <div className="payment-info">
                                        <span className="payment-label">Pay Online Securely</span>
                                        <span className="payment-desc">UPI, Cards, Netbanking via Razorpay.</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <aside className="checkout-summary-card">
                        <h3 className="summary-title">Order Overview</h3>

                        <div className="summary-items">
                            {cartItems.map(item => (
                                <div key={item.id || item._id} className="summary-item-row">
                                    <span className="summary-item-name">{item.name} <small>x {item.quantity}</small></span>
                                    <span className="summary-item-price">₹{(Number(item.price) * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        <div className="price-breakdown">
                            <div className="price-row">
                                <span>Bag Total</span>
                                <span>₹{totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="price-row">
                                <span>Shipping Fee</span>
                                <span style={{ color: totalAmount > 999 ? '#10b981' : 'inherit' }}>
                                    {totalAmount > 999 ? 'FREE' : '₹50'}
                                </span>
                            </div>
                            <div className="price-row total-row">
                                <span>Total Amount</span>
                                <span>₹{(totalAmount + (totalAmount > 999 ? 0 : 50)).toLocaleString()}</span>
                            </div>
                        </div>

                        {deliveryEstimate && (
                            <div className="delivery-estimate-card" style={{
                                marginTop: '2rem',
                                padding: '1.25rem',
                                background: '#f8fafc',
                                border: '1px dashed #cbd5e1',
                                borderRadius: '12px',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🚚</div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                                    Expected Delivery
                                </div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                                    {deliveryEstimate}
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            form="checkout-form"
                            className="place-order-btn"
                            disabled={loading}
                        >
                            {loading ? 'Completing Order...' : (paymentMethod === 'online' ? 'Proceed to Pay' : 'Confirm Order')}
                        </button>

                        <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', lineHeight: '1.4' }}>
                            By placing an order, you agree to The Vanity's <Link to="/terms" style={{ color: 'inherit' }}>Terms and Conditions</Link>.
                        </p>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
