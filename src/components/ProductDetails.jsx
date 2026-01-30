
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaHeart, FaRegHeart, FaStar, FaChevronDown, FaChevronUp } from 'react-icons/fa';

import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import ProductCard from './ProductCard';
import ProductSlider from './ProductSlider';
import API_BASE_URL from '../config';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [showQuantityModal, setShowQuantityModal] = useState(false);
    const { isAuthenticated } = useAuth(); // Keeping for future checks if needed
    const { addToBag, addToWishlist, removeFromWishlist, isInWishlist } = useShop();

    // UI States
    const [activeImage, setActiveImage] = useState(0);
    const [openAccordion, setOpenAccordion] = useState('description');
    const [showReviewForm, setShowReviewForm] = useState(false);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // Touch handling for swipe
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.target.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        const images = getImages();
        if (!images || images.length === 0) return;

        const swipeThreshold = 50;
        const diff = touchStart - touchEnd;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                setActiveImage((prev) => (prev + 1) % images.length);
            } else {
                setActiveImage((prev) => (prev - 1 + images.length) % images.length);
            }
        }
    };

    const getImages = () => {
        if (!product) return [];
        const getImageUrl = (url) => {
            if (url && !url.startsWith('http') && !url.startsWith('data:')) {
                return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
            }
            return url;
        };

        const images = product.images?.length > 0
            ? product.images.map(img => getImageUrl(img.imageUrl))
            : [getImageUrl(product.image) || 'https://via.placeholder.com/500?text=No+Image'];

        if (images.length === 0 || !images[0]) {
            images[0] = 'https://via.placeholder.com/500?text=No+Image';
        }
        return images;
    };

    // Keyboard navigation for images
    useEffect(() => {
        const images = getImages();
        if (images.length === 0) return;

        const handleKeyDown = (e) => {
            if (images.length === 0) return;
            if (e.key === 'ArrowLeft') {
                setActiveImage((prev) => (prev - 1 + images.length) % images.length);
            } else if (e.key === 'ArrowRight') {
                setActiveImage((prev) => (prev + 1) % images.length);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [product]);

    // Fetch recommended products from API
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [reviewFormData, setReviewFormData] = useState({
        rating: 5,
        comment: ''
    });

    useEffect(() => {
        const fetchRecommended = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/products?limit=10&exclude=${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setRecommendedProducts(data.data || []);
                }
            } catch (err) {
                console.error('Error fetching recommended products:', err);
            }
        };
        // Verify product exists before fetching recommendations if logic depends on it, 
        // or just fetch general recommendations. The original code waited for product.
        if (product) fetchRecommended();
    }, [id, product]);

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            window.scrollTo(0, 0);
            setQuantity(1);
            setActiveImage(0);
            setShowReviewForm(false);

            // Fetch from API
            try {
                const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
                const resData = await res.json();
                if (res.ok) {
                    const productData = resData.data;
                    setProduct(productData);
                } else {
                    setProduct(null);
                }
            } catch (err) {
                console.error("Error loading product:", err);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="product-details-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <h2>Loading...</h2>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-details-error">
                <h2>Product not found</h2>
                <p>We couldn't find the product you're looking for.</p>
                <button onClick={() => navigate('/')} style={{ marginTop: '20px', padding: '10px 20px' }}>Go Home</button>
            </div>
        );
    }

    const isWishlisted = isInWishlist(product.id);
    const images = getImages();

    const handleAddToBag = () => {
        if (!isAuthenticated) {
            toast.error('Please sign in to add to bag');
            navigate('/login');
            return;
        }
        addToBag(product, quantity);
        toast.success(`Added ${quantity} of ${product.name} to bag!`);
    };

    const handleWishlist = () => {
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

    const toggleAccordion = (section) => {
        setOpenAccordion(openAccordion === section ? null : section);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error('Please sign in to write a review');
            navigate('/login');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/reviews/${product._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(reviewFormData)
            });

            const data = await res.json();
            if (data.success) {
                toast.success('Thank you for your review!');
                // Update local product state with new reviews
                const updatedReviews = data.data;
                const newNumOfReviews = updatedReviews.length;
                const newAvgRating = updatedReviews.reduce((acc, item) => item.rating + acc, 0) / newNumOfReviews;

                setProduct(prev => ({
                    ...prev,
                    reviews: updatedReviews,
                    numOfReviews: newNumOfReviews,
                    averageRating: newAvgRating
                }));

                setShowReviewForm(false);
                setReviewFormData({ rating: 5, comment: '' });
            } else {
                toast.error(data.error || 'Failed to submit review');
            }
        } catch (err) {
            console.error('Review error:', err);
            toast.error('Something went wrong');
        }
    };

    return (
        <div className="product-details-page">
            <div className="pd-breadcrumb">
                Home <span>/</span> {product.brand} <span>/</span> {product.category || 'Jewelry'} <span>/</span> {product.name}
            </div>

            <div className="pd-container">
                {/* Left: Images */}
                <div className="pd-image-section">
                    <div className="pd-thumbnails">
                        {images.map((img, idx) => (
                            <li key={idx}>
                                <img
                                    src={img}
                                    className={`thumb-image ${activeImage === idx ? 'active' : ''}`}
                                    onClick={() => setActiveImage(idx)}
                                    alt={`Thumbnail ${idx}`}
                                />
                            </li>
                        ))}
                    </div>
                    <div className="pd-thumbnails-mobile">
                        {images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                className={`thumb-image-mobile ${activeImage === idx ? 'active' : ''}`}
                                onClick={() => setActiveImage(idx)}
                                alt={`Thumbnail ${idx}`}
                            />
                        ))}
                    </div>
                    <div
                        className="pd-main-image"
                        onClick={() => {
                            setActiveImage((prev) => (prev + 1) % images.length);
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <img src={images[activeImage]} alt={product.name} />
                    </div>
                    <div className="pd-image-dots">
                        {images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`pd-image-dot ${activeImage === idx ? 'active' : ''}`}
                                onClick={() => setActiveImage(idx)}
                            />
                        ))}
                    </div>
                </div>

                {/* Right: Info */}
                <div className="pd-info-section">
                    <div className="pd-brand">{product.brand}</div>
                    <h1 className="pd-title">{product.name}</h1>
                    <div className="pd-description-short">{product.description ? product.description.substring(0, 100) : ''}...</div>

                    <div className="pd-rating">
                        <div className="stars">
                            {[...Array(5)].map((_, i) => (
                                <FaStar key={i} color={i < Math.round(product.averageRating || 0) ? "#000" : "#ddd"} />
                            ))}
                        </div>
                        <span className="review-count">{(product.numOfReviews || 0)} reviews</span>
                    </div>

                    <div className="pd-price-box">
                        {product.originalPrice && (
                            <span className="pd-original-price">₹{product.originalPrice}</span>
                        )}
                        <span className="pd-current-price">₹{product.price}</span>
                    </div>

                    <div className="pd-actions">
                        <div className="quantity-selector-container">
                            <label className="qty-label">Quantity</label>
                            <div className="quantity-selector">
                                <button
                                    className="qty-btn"
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                >-</button>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={quantity}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        // Allow empty string for editing
                                        if (val === '') {
                                            setQuantity('');
                                        } else if (/^\d+$/.test(val)) {
                                            // Only accept positive integers
                                            const num = parseInt(val);
                                            if (num >= 1 && num <= 999) {
                                                setQuantity(num);
                                            }
                                        }
                                    }}
                                    onBlur={(e) => {
                                        // On blur, ensure we have a valid number
                                        if (e.target.value === '' || parseInt(e.target.value) < 1) {
                                            setQuantity(1);
                                        }
                                    }}
                                    onFocus={(e) => e.target.select()}
                                    className="qty-input"
                                />
                                <button
                                    className="qty-btn"
                                    onClick={() => setQuantity(prev => prev + 1)}
                                >+</button>
                            </div>
                        </div>
                        <div className="action-buttons-row">
                            {product.stock <= 0 ? (
                                <button className="pd-add-to-bag-btn disabled" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                                    Out of Stock
                                </button>
                            ) : (
                                <button className="pd-add-to-bag-btn" onClick={handleAddToBag}>
                                    Add to Bag
                                </button>
                            )}
                            <button className="pd-wishlist-btn" onClick={handleWishlist}>
                                {isWishlisted ? <FaHeart color="#e63946" /> : <FaRegHeart />}
                                <span>{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
                            </button>
                        </div>
                    </div>

                    <div className="pd-shipping-info">
                        <div className="info-row">
                            <span>🚚</span>
                            <div>
                                <strong>Free Standard Shipping</strong>
                                <div style={{ fontSize: '0.8rem', marginTop: '2px' }}>On orders over ₹999. Estimated delivery 2-4 days.</div>
                            </div>
                        </div>
                        <div className="info-row" style={{ marginTop: '15px' }}>
                            <span>↩️</span>
                            <div>
                                <strong>Easy Returns</strong>
                                <div style={{ fontSize: '0.8rem', marginTop: '2px' }}>15-day return policy for unused items.</div>
                            </div>
                        </div>
                    </div>

                    <div className="pd-accordions">
                        <div className="accordion-item">
                            <button className="accordion-header" onClick={() => toggleAccordion('description')}>
                                Description
                                {openAccordion === 'description' ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                            {openAccordion === 'description' && (
                                <div className="accordion-content">
                                    <p>{product.description}</p>
                                    <p>Experience the luxury of {product.brand}. This product is designed to enhance your style with high-quality craftsmanship.</p>
                                </div>
                            )}
                        </div>

                        {/* Reviews Section */}
                        <div className="accordion-item">
                            <button className="accordion-header" onClick={() => toggleAccordion('reviews')}>
                                Ratings & Reviews ({product.reviews?.length || 0})
                                {openAccordion === 'reviews' ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                            {openAccordion === 'reviews' && (
                                <div className="accordion-content">
                                    <div className="reviews-summary" style={{ marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Overall Rating {product.averageRating?.toFixed(1) || '0.0'}</div>
                                            <button
                                                onClick={() => setShowReviewForm(!showReviewForm)}
                                                style={{
                                                    padding: '8px 15px',
                                                    background: '#000',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                {showReviewForm ? 'Cancel' : 'Write a Review'}
                                            </button>
                                        </div>
                                        {showReviewForm && (
                                            <form onSubmit={handleReviewSubmit} className="write-review-form" style={{ marginTop: '15px', padding: '15px', background: '#f9f9f9', borderRadius: '4px' }}>
                                                <div style={{ marginBottom: '10px' }}>
                                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Rating</label>
                                                    <div className="stars-input">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar
                                                                key={i}
                                                                onClick={() => setReviewFormData({ ...reviewFormData, rating: i + 1 })}
                                                                color={i < reviewFormData.rating ? "#000" : "#ddd"}
                                                                style={{ cursor: 'pointer', marginRight: '5px' }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div style={{ marginBottom: '10px' }}>
                                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Your Review</label>
                                                    <textarea
                                                        required
                                                        value={reviewFormData.comment}
                                                        onChange={(e) => setReviewFormData({ ...reviewFormData, comment: e.target.value })}
                                                        placeholder="Tell us what you like about this product..."
                                                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '100px', fontSize: '0.9rem' }}
                                                    />
                                                </div>
                                                <button type="submit" style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Submit Review</button>
                                            </form>
                                        )}
                                    </div>

                                    <div className="reviews-list">
                                        {product.reviews && product.reviews.length > 0 ? (
                                            product.reviews.map((review, idx) => (
                                                <div key={idx} className="review-item" style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                        <div style={{ fontWeight: 'bold' }}>{review.name}</div>
                                                        <div style={{ color: '#777', fontSize: '0.85rem' }}>{new Date(review.createdAt).toLocaleDateString()}</div>
                                                    </div>
                                                    <div style={{ marginBottom: '8px' }}>
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar key={i} size={12} color={i < review.rating ? "#000" : "#ddd"} />
                                                        ))}
                                                    </div>
                                                    <p style={{ fontSize: '0.95rem', color: '#444', lineHeight: '1.5' }}>{review.comment}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p style={{ textAlign: 'center', color: '#777', padding: '20px 0' }}>No reviews yet. Be the first to review this product!</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Bottom Bar */}
            <div className="pd-mobile-sticky-bar">
                <div className="pd-mobile-bar-content">
                    <div className="pd-mobile-price-qty">
                        <div className="pd-mobile-price">
                            <span className="pd-mobile-current">₹{product.price}</span>
                            {product.originalPrice && (
                                <span className="pd-mobile-original">₹{product.originalPrice}</span>
                            )}
                        </div>
                        <div className="pd-mobile-quantity-selector">
                            <button
                                className="pd-mobile-qty-btn"
                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                            >-</button>
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={quantity}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    // Allow empty string for editing
                                    if (val === '') {
                                        setQuantity('');
                                    } else if (/^\d+$/.test(val)) {
                                        // Only accept positive integers
                                        const num = parseInt(val);
                                        if (num >= 1 && num <= 999) {
                                            setQuantity(num);
                                        }
                                    }
                                }}
                                onBlur={(e) => {
                                    // On blur, ensure we have a valid number
                                    if (e.target.value === '' || parseInt(e.target.value) < 1) {
                                        setQuantity(1);
                                    }
                                }}
                                onFocus={(e) => e.target.select()}
                                className="pd-mobile-qty-input"
                            />
                            <button
                                className="pd-mobile-qty-btn"
                                onClick={() => setQuantity(prev => prev + 1)}
                            >+</button>
                        </div>
                    </div>
                    <div className="pd-mobile-actions">
                        <button className="pd-mobile-wishlist" onClick={handleWishlist}>
                            {isWishlisted ? <FaHeart color="#e63946" /> : <FaRegHeart />}
                        </button>
                        {product.stock <= 0 ? (
                            <button className="pd-mobile-add disabled" disabled>
                                Out of Stock
                            </button>
                        ) : (
                            <button className="pd-mobile-add" onClick={handleAddToBag}>
                                ADD
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Quantity Selection Modal */}
            {showQuantityModal && (
                <div className="pd-modal-overlay" onClick={() => setShowQuantityModal(false)}>
                    <div className="pd-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="pd-modal-header">
                            <h3>Select Quantity</h3>
                            <button
                                className="pd-modal-close"
                                onClick={() => setShowQuantityModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="pd-modal-body">
                            <div className="pd-modal-quantity-grid">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((qty) => (
                                    <button
                                        key={qty}
                                        className={`pd-qty-option ${quantity === qty ? 'active' : ''}`}
                                        onClick={() => {
                                            setQuantity(qty);
                                            setShowQuantityModal(false);
                                        }}
                                    >
                                        {qty}
                                    </button>
                                ))}
                            </div>
                            <div className="pd-modal-total">
                                Total: ₹{(product.price * quantity).toLocaleString()}
                            </div>
                        </div>
                        <button
                            className="pd-modal-confirm"
                            onClick={() => {
                                setShowQuantityModal(false);
                                handleAddToBag();
                            }}
                        >
                            Add to Bag ({quantity} item{quantity > 1 ? 's' : ''})
                        </button>
                    </div>
                </div>
            )}

            {/* Recommended Products */}
            {recommendedProducts.length > 0 && (
                <div className="recommended-section" style={{ marginTop: '50px' }}>
                    <ProductSlider title="You May Also Like" products={recommendedProducts} />
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
