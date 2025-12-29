import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { addToBag, addToWishlist, isInWishlist, removeFromWishlist } = useShop();

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
            <div className="product-image-container">
                <img src={product.image} alt={product.name} className="product-image" />
                <button className="wishlist-btn" onClick={handleWishlist}>
                    {isWishlisted ? '♥' : '♡'}
                </button>
                <button className="add-to-bag-btn" onClick={handleAddToBag}>
                    Add to Bag
                </button>
            </div>
            <div className="product-info">
                <span className="product-brand">{product.brand}</span>
                <h3 className="product-title">{product.name}</h3>
                <div className="price-container">
                    <span className="current-price">{product.price}</span>
                    {product.originalPrice && <span className="original-price">{product.originalPrice}</span>}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
