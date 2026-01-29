import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import API_BASE_URL from '../config';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { addToBag, addToWishlist, isInWishlist, removeFromWishlist } = useShop();

    const getImageUrl = (p) => {
        let url = p.images?.[0]?.imageUrl || p.image || 'https://via.placeholder.com/300?text=No+Image';
        if (url && !url.startsWith('http') && !url.startsWith('data:')) {
            return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
        }
        return url;
    };

    const isWishlisted = isInWishlist(product.id);

    const handleCardClick = () => {
        navigate(`/product/${product.id}`);
    };

    const handleAddToBag = (e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            toast.error('Please sign in to add to bag');
            navigate('/login');
            return;
        }
        addToBag(product);
        toast.success(`${product.name} added to bag!`);
    };

    const handleWishlist = (e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            toast.error('Please sign in to manage wishlist');
            navigate('/login');
            return;
        }
        if (isWishlisted) {
            removeFromWishlist(product.id);
            toast.error('Removed from wishlist');
        } else {
            addToWishlist(product);
            toast.success('Added to wishlist');
        }
    };

    return (
        <div className="product-card" onClick={handleCardClick}>
            <div className={`product-image-container ${product.stock <= 0 ? 'out-of-stock' : ''}`}>
                <img
                    src={getImageUrl(product)}
                    alt={product.name}
                    className="product-image"
                />
                <button className={`wishlist-btn ${isWishlisted ? 'active' : ''}`} onClick={handleWishlist}>
                    {isWishlisted ? '♥' : '♡'}
                </button>
                {product.stock <= 0 ? (
                    <div className="out-of-stock-badge">Out of Stock</div>
                ) : (
                    <button className="add-to-bag-btn" onClick={handleAddToBag}>
                        Add to Bag
                    </button>
                )}
            </div>
            <div className="product-info">
                <span className="product-brand">{product.brand || 'VANITY LUXE'}</span>
                <h3 className="product-title">{product.name}</h3>

                <div className="price-container">
                    {product.originalPrice > product.price && (
                        <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                    )}
                    <span className="current-price">₹{product.price.toLocaleString()}</span>
                    {product.originalPrice > product.price && (
                        <span className="discount-badge">
                            ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF)
                        </span>
                    )}
                </div>

                <div className="product-rating">
                    <span className="stars">
                        {'★'.repeat(Math.round(product.averageRating))}{'☆'.repeat(5 - Math.round(product.averageRating))}
                    </span>
                    <span className="review-count">({(product.numOfReviews || 0).toLocaleString()})</span>
                    <span className="info-icon">ⓘ</span>
                </div>

                <div className="shade-info">
                    {product.shade}
                    {product.extraInfo && <div className="extra-info">{product.extraInfo}</div>}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
