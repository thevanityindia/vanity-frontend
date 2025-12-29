import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import './InfoPage.css'; // Reusing some basic styles

const Bag = () => {
    const { isAuthenticated } = useAuth();
    const { cartItems, removeFromBag, updateQuantity } = useShop();
    const navigate = useNavigate();

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
        // Parse price removing currency symbol and commas
        const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
        return acc + price * item.quantity;
    }, 0);

    return (
        <div className="info-page">
            <div className="info-container" style={{ maxWidth: '1000px' }}>
                <h1>My Shopping Bag ({cartItems.length} items)</h1>

                {cartItems.length === 0 ? (
                    <div className="empty-bag" style={{ textAlign: 'center', padding: '3rem 0' }}>
                        <p>Your bag is currently empty.</p>
                        <Link to="/" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Start Shopping</Link>
                    </div>
                ) : (
                    <div className="bag-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginTop: '30px' }}>
                        <div className="bag-items">
                            {cartItems.map(item => (
                                <div key={item.id} className="bag-item" style={{ display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                                    <div className="item-image" style={{ width: '120px', height: '120px', background: '#f9f9f9', borderRadius: '8px' }}>
                                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </div>
                                    <div className="item-details" style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem', color: '#666' }}>{item.brand}</div>
                                        <h3 style={{ margin: '5px 0', fontSize: '1.1rem' }}>{item.name}</h3>
                                        <div style={{ margin: '10px 0', fontWeight: 'bold' }}>{item.price}</div>

                                        <div className="item-actions" style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '10px' }}>
                                            <div className="qty-control" style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px' }}>
                                                <button onClick={() => updateQuantity(item.id, -1)} style={{ padding: '5px 10px', border: 'none', background: 'transparent', cursor: 'pointer' }}>-</button>
                                                <span style={{ padding: '0 10px' }}>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} style={{ padding: '5px 10px', border: 'none', background: 'transparent', cursor: 'pointer' }}>+</button>
                                            </div>
                                            <button onClick={() => removeFromBag(item.id)} style={{ background: 'none', border: 'none', textDecoration: 'underline', color: '#666', cursor: 'pointer', fontSize: '0.9rem' }}>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bag-summary" style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', height: 'fit-content' }}>
                            <h3 style={{ marginTop: 0, borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Order Summary</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '15px 0' }}>
                                <span>Subtotal</span>
                                <span>₹{totalAmount.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '15px 0' }}>
                                <span>Shipping</span>
                                <span style={{ color: 'green' }}>FREE</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0 0', paddingTop: '15px', borderTop: '1px solid #ddd', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                <span>Total</span>
                                <span>₹{totalAmount.toFixed(2)}</span>
                            </div>

                            <button style={{
                                width: '100%',
                                background: '#000',
                                color: '#fff',
                                border: 'none',
                                padding: '15px',
                                borderRadius: '30px',
                                marginTop: '20px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}>Checkout</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bag;
