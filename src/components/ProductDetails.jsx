
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaHeart, FaRegHeart, FaStar, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { mockProducts } from '../data/mockProducts';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import ProductCard from './ProductCard'; // Reuse for recommended section
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const { isAuthenticated } = useAuth(); // Keeping for future checks if needed
    const { addToBag, addToWishlist, removeFromWishlist, isInWishlist } = useShop();

    // UI States
    const [activeImage, setActiveImage] = useState(0);
    const [openAccordion, setOpenAccordion] = useState('description');
    const [showReviewForm, setShowReviewForm] = useState(false);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            window.scrollTo(0, 0);
            setQuantity(1);
            setActiveImage(0);
            setShowReviewForm(false);

            // 1. Check Mock Products first (optimization for static data)
            const mock = mockProducts.find(p => p.id == id);
            if (mock) {
                setProduct(mock);
                setLoading(false);
                return;
            }

            // 2. Fetch from API
            try {
                const res = await fetch(`http://localhost:5000/api/products/${id}`);
                const data = await res.json();
                if (res.ok) {
                    // Normalize fields if needed (e.g. handle missing reviews/ratings)
                    setProduct({
                        ...data,
                        rating: data.rating || 4.5,
                        reviews: data.reviews || 0,
                        originalPrice: data.originalPrice || null
                    });
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

    // Filter recommended products (exclude current)
    const recommendedProducts = mockProducts.filter(p => p.id !== id).slice(0, 4);

    // Mock Thumbnails (Repeat the same image or use placeholders if no multiple images)
    // In real app, product.images would be an array
    const images = [product.image, product.image, product.image, product.image];

    // Mock Reviews
    const mockReviews = [
        {
            user: "Ananya S.",
            rating: 5,
            date: "2 days ago",
            title: "Absolutely in love!",
            comment: `I've been wearing this ${product.name} every day since I got it. The quality is amazing and it looks even better in person.`
        },
        {
            user: "Priya M.",
            rating: 4,
            date: "1 week ago",
            title: "Great purchase",
            comment: "Really happy with the design and finish. Shipping was fast too. deducting one star because the packaging could be slightly better."
        },
        {
            user: "Rhea K.",
            rating: 5,
            date: "2 weeks ago",
            title: "Stunning piece",
            comment: "Matches perfectly with my outfits. I've received so many compliments!"
        }
    ];

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
                            <img
                                key={idx}
                                src={img}
                                className={`thumb-image ${activeImage === idx ? 'active' : ''}`}
                                onClick={() => setActiveImage(idx)}
                                alt={`Thumbnail ${idx}`}
                            />
                        ))}
                    </div>
                    <div className="pd-main-image">
                        <img src={images[activeImage]} alt={product.name} />
                    </div>
                </div>

                {/* Right: Info */}
                <div className="pd-info-section">
                    <div className="pd-brand">{product.brand}</div>
                    <h1 className="pd-title">{product.name}</h1>
                    <div className="pd-description-short">{product.description.substring(0, 100)}...</div>

                    <div className="pd-rating">
                        <div className="stars">
                            {[...Array(5)].map((_, i) => (
                                <FaStar key={i} color={i < Math.round(product.rating) ? "#000" : "#ddd"} />
                            ))}
                        </div>
                        <span className="review-count">{product.reviews} reviews</span>
                    </div>

                    <div className="pd-price-box">
                        <span className="pd-current-price">{product.price}</span>
                        {product.originalPrice && <span className="pd-original-price" style={{ marginLeft: '10px' }}>{product.originalPrice}</span>}
                    </div>

                    <div className="pd-actions">
                        <div className="quantity-selector" style={{ width: 'fit-content', marginBottom: '10px' }}>
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)}>+</button>
                        </div>
                        <div className="action-buttons-row">
                            <button className="pd-add-to-bag-btn" onClick={handleAddToBag}>
                                Add to Bag
                            </button>
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
                                Ratings & Reviews ({mockReviews.length})
                                {openAccordion === 'reviews' ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                            {openAccordion === 'reviews' && (
                                <div className="accordion-content">
                                    <div className="reviews-summary" style={{ marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Overall Rating</div>
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
                                                Write a Review
                                            </button>
                                        </div>
                                        {showReviewForm && (
                                            <div className="write-review-form" style={{ marginTop: '15px', padding: '15px', background: '#f9f9f9', borderRadius: '4px' }}>
                                                <div style={{ marginBottom: '10px' }}>
                                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Rating</label>
                                                    <div className="stars-input">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar key={i} color="#ddd" style={{ cursor: 'pointer' }} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div style={{ marginBottom: '10px' }}>
                                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Review Title</label>
                                                    <input type="text" placeholder="Example: Beautiful ring!" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                                                </div>
                                                <div style={{ marginBottom: '10px' }}>
                                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Review</label>
                                                    <textarea placeholder="Tell us what you like about this product..." style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }} />
                                                </div>
                                                <button onClick={() => { toast.success("Review submitted!"); setShowReviewForm(false); }} style={{ padding: '8px 15px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Submit Review</button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="reviews-list">
                                        {mockReviews.map((review, idx) => (
                                            <div key={idx} className="review-item" style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                    <div style={{ fontWeight: 'bold' }}>{review.title}</div>
                                                    <div style={{ color: '#777', fontSize: '0.85rem' }}>{review.date}</div>
                                                </div>
                                                <div style={{ marginBottom: '8px' }}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar key={i} size={12} color={i < review.rating ? "#000" : "#ddd"} />
                                                    ))}
                                                </div>
                                                <p style={{ fontSize: '0.95rem', color: '#444', lineHeight: '1.5' }}>{review.comment}</p>
                                                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>- {review.user}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommended Products */}
            <div className="recommended-section">
                <div className="recommended-title">You May Also Like</div>
                <div className="recommended-grid">
                    {recommendedProducts.map(recProduct => (
                        <ProductCard key={recProduct.id} product={recProduct} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
