import React from 'react';
import ProductCard from './ProductCard';
import './ProductSlider.css';

const ProductSlider = ({ products, title }) => {
    // Duplicate products to create seamless loop
    // Ensure we have enough products to scroll
    const displayProducts = products.length < 5 ? [...products, ...products, ...products] : [...products, ...products];

    return (
        <section className="product-slider-section">
            <h2>{title}</h2>
            <div className="product-slider-container">
                <div className="product-slider-track">
                    {displayProducts.map((product, index) => (
                        <div key={`${product.id}-${index}`} className="product-slider-item">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductSlider;
