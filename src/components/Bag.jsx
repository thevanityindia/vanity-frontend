import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import './Bag.css';
import { useConfirm } from '../context/ConfirmContext';

const Bag = () => {
    const { isAuthenticated } = useAuth();
    const { cartItems, removeFromBag, updateQuantity, clearCart } = useShop();
    const navigate = useNavigate();
    const confirm = useConfirm();

    // ... (rest of code)
    if (!isAuthenticated) {
        return (
            <div className="info-page">
                <div className="info-container">
                    <h1>Shopping Bag</h1>
                    <div className="info-content" style={{ textAlign: 'center', padding: '3rem 0' }}>
                        <p>Sign in to see your bag and access your saved items.</p>
                        <div style={{ marginTop: '2rem' }}>
                            <Link to="/login" style={{
                                background: '#000',
                                color: '#fff',
                                padding: '10px 20px',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                borderRadius: '4px'
                            }}>Sign In</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const totalAmount = cartItems.reduce((acc, item) => {
        const price = parseFloat(item.price) || 0;
        return acc + price * item.quantity;
    }, 0);

    return (
        <div className="bag-page">
            <div className="bag-container">
                <div className="bag-header">
                    <h1>My Shopping Bag ({cartItems.length} items)</h1>
                    {cartItems.length > 0 && (
                        <button
                            className="clear-all-btn"
                            onClick={async () => {
                                const confirmed = await confirm({
                                    title: 'Clear Bag',
                                    message: 'Are you sure you want to remove all items from your bag? This action cannot be undone.',
                                    confirmText: 'Yes, Clear All',
                                    cancelText: 'Keep Items',
                                    type: 'danger'
                                });
                                if (confirmed) clearCart();
                            }}
                        >
                            Clear All
                        </button>
                    )}
                </div>

                {cartItems.length === 0 ? (
                    <div className="empty-bag">
                        <p>Your bag is currently empty.</p>
                        <Link to="/">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="bag-grid">
                        <div className="bag-items">
                            {cartItems.map(item => (
                                <div key={item.id} className="bag-item">
                                    <div className="item-image">
                                        <img src={item.images?.[0]?.imageUrl || item.image || 'https://via.placeholder.com/150'} alt={item.name} />
                                    </div>
                                    <div className="item-details">
                                        <div className="item-brand">{item.brand}</div>
                                        <h3 className="item-name">{item.name}</h3>
                                        <div className="item-price">₹{Number(item.price).toLocaleString()}</div>

                                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '15px' }}>
                                            <div className="qty-control">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                                />
                                            </div>
                                            <button className="remove-btn" onClick={() => removeFromBag(item.id)}>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bag-summary">
                            {/* Keep existing summary logic but wrap in correct class */}
                            <h3>Order Summary</h3>
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>₹{totalAmount.toLocaleString()}</span>
                            </div>
                            <button className="checkout-btn" onClick={() => navigate('/checkout')}>
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bag;
