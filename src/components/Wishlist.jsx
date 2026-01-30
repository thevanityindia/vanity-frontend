import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import ProductCard from './ProductCard'; // Reuse ProductCard
import './Wishlist.css'; // Import dedicated CSS

const Wishlist = () => {
    const { isAuthenticated } = useAuth();
    const { wishlistItems } = useShop();

    if (!isAuthenticated) {
        return (
            <div className="wishlist-page-wrapper">
                <div className="auth-message-wrapper">
                    <div className="auth-message-box">
                        <h1>My Wishlist</h1>
                        <p style={{ marginBottom: '30px', color: '#666' }}>Please sign in to view and manage your wishlist.</p>
                        <Link to="/login" className="wishlist-btn-primary">Sign In</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="wishlist-page-wrapper">
            <div className="wishlist-container">
                <div className="wishlist-header">
                    <h1 className="wishlist-title">My Wishlist</h1>
                    <span className="wishlist-count">{wishlistItems.length} Items</span>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="wishlist-empty-state">
                        <h2 className="wishlist-empty-title">Your wishlist is empty</h2>
                        <p className="wishlist-empty-text">Save items you love to buy later!</p>
                        <Link to="/" className="wishlist-btn-primary">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="wishlist-grid">
                        {wishlistItems.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
