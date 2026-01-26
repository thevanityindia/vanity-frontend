import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegTrashAlt, FaTimes } from 'react-icons/fa';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config';
import './MiniBag.css';

const MiniBag = ({ isOpen, onClose }) => {
    const { cartItems, removeFromBag } = useShop();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const getImageUrl = (item) => {
        let url = item.images?.[0]?.imageUrl || item.image || 'https://via.placeholder.com/300?text=No+Image';
        if (url && !url.startsWith('http') && !url.startsWith('data:')) {
            return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
        }
        return url;
    };

    const total = cartItems.reduce((acc, item) => {
        const priceValue = parseFloat(item.price) || 0;
        return acc + (priceValue * item.quantity);
    }, 0);

    if (!isOpen) return null;

    return (
        <div className="mini-bag-overlay" onClick={onClose}>
            <div className="mini-bag-content" onClick={e => e.stopPropagation()}>
                <div className="mini-bag-header">
                    <h3>BAG</h3>
                    <button className="close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="mini-bag-items">
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <div key={item.id || item._id} className="mini-bag-item">
                                <div className="item-image">
                                    <img
                                        src={getImageUrl(item)}
                                        alt={item.name}
                                    />
                                </div>
                                <div className="item-details">
                                    <div className="item-brand-row">
                                        <span className="item-brand">{item.brand}</span>
                                        <button
                                            className="remove-item"
                                            onClick={() => removeFromBag(item.id || item._id)}
                                        >
                                            <FaRegTrashAlt />
                                        </button>
                                    </div>
                                    <p className="item-name">{item.name}</p>
                                    <p className="item-price">₹{Number(item.price).toLocaleString()}</p>
                                    <p className="item-qty">Qty: {item.quantity}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-mini-bag">
                            Your bag is empty
                        </div>
                    )}
                </div>

                <div className="mini-bag-footer">
                    <div className="total-row">
                        <span className="total-label">Total: ₹{total.toLocaleString()}</span>
                    </div>

                    <div className="footer-actions">
                        {!isAuthenticated && (
                            <Link to="/login" className="sign-in-link" onClick={onClose}>
                                Sign in <br /> <span>to save your items</span>
                            </Link>
                        )}
                        <button
                            className="view-bag-btn"
                            onClick={() => {
                                navigate('/bag');
                                onClose();
                            }}
                        >
                            VIEW BAG
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MiniBag;
