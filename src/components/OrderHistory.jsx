import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config';

import './OrderHistory.css';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/api/orders/my-orders`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();

                if (data.success) {
                    setOrders(data.data);
                } else {
                    console.error('Failed to fetch orders:', data.error);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [isAuthenticated, navigate]);

    if (loading) {
        return (
            <div className="order-history-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="loader">Loading...</div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="order-history-page">
                <div className="empty-state">
                    <h2>No orders found</h2>
                    <p>Looks like you haven't placed any orders yet.</p>
                    <button className="continue-btn" onClick={() => navigate('/')}>
                        Start Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="order-history-page">
            <div className="order-history-container">
                <h1>My Orders</h1>

                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order._id} className="order-card">
                            <div className="order-header">
                                <div className="order-info">
                                    <div className="info-group">
                                        <span className="info-label">Order placed</span>
                                        <span className="info-value">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="info-group">
                                        <span className="info-label">Total</span>
                                        <span className="info-value">₹{order.totalAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="info-group">
                                        <span className="info-label">Order #</span>
                                        <span className="info-value">{order.orderNumber || order._id.slice(-6).toUpperCase()}</span>
                                    </div>
                                </div>
                                <div className={`order-status status-${order.status || 'pending'}`}>
                                    {order.status || 'Processing'}
                                </div>
                            </div>

                            <div className="order-items">
                                {order.items.map((item, index) => (
                                    <div key={index} className="order-item">
                                        <img
                                            src={item.image || 'https://via.placeholder.com/60'}
                                            alt={item.name}
                                            className="item-image"
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/60'; }}
                                        />
                                        <div className="item-details">
                                            <span className="item-name">{item.name}</span>
                                            <span className="item-meta">
                                                Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;
