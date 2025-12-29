import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import ProductCard from './ProductCard'; // Reuse ProductCard
import './InfoPage.css';

const Wishlist = () => {
    const { isAuthenticated } = useAuth();
    const { wishlistItems } = useShop();

    if (!isAuthenticated) {
        return (
            <div className="info-page">
                <div className="info-container">
                    <h1>My Wishlist</h1>
                    <div className="info-content" style={{ textAlign: 'center', padding: '3rem 0' }}>
                        <p>Please sign in to view your wishlist.</p>
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

    return (
        <div className="info-page">
            <div className="info-container">
                <h1>My Wishlist ({wishlistItems.length})</h1>

                {wishlistItems.length === 0 ? (
                    <div className="info-content" style={{ textAlign: 'center', padding: '3rem 0' }}>
                        <p>Your wishlist is currently empty.</p>
                        <Link to="/" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Continue Shopping</Link>
                    </div>
                ) : (
                    <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' }}>
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
