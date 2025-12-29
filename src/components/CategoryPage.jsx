import React from 'react';
import './CategoryPage.css';
import { mockProducts } from '../data/mockProducts';
import ProductCard from './ProductCard';

const CategoryPage = ({ title }) => {
    const [selectedBrands, setSelectedBrands] = React.useState([]);
    const [selectedPriceRanges, setSelectedPriceRanges] = React.useState([]);
    const [sortBy, setSortBy] = React.useState('Bestsellers');

    // 1. First, get products that match the page category
    const baseProducts = React.useMemo(() => {
        return mockProducts.filter(product => {
            if (title === 'Artificial Jewellery') {
                return product.category === 'Artificial Jewellery';
            }
            return product.category === title || product.category.includes(title);
        });
    }, [title]);

    // 2. Extract unique brands for the sidebar
    const availableBrands = React.useMemo(() => {
        const brands = new Set(baseProducts.map(p => p.brand));
        return Array.from(brands);
    }, [baseProducts]);

    // 3. Handlers for filters
    const handleBrandChange = (brand) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    const handlePriceChange = (range) => {
        setSelectedPriceRanges(prev =>
            prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]
        );
    };

    // 4. Apply filters and sorting
    const filteredAndSortedProducts = React.useMemo(() => {
        let result = [...baseProducts];

        // Filter by Brand
        if (selectedBrands.length > 0) {
            result = result.filter(p => selectedBrands.includes(p.brand));
        }

        // Filter by Price
        if (selectedPriceRanges.length > 0) {
            result = result.filter(p => {
                const price = parseInt(p.price.replace(/[₹,]/g, ''));
                return selectedPriceRanges.some(range => {
                    if (range === 'Under ₹500') return price < 500;
                    if (range === '₹500 - ₹1000') return price >= 500 && price <= 1000;
                    if (range === 'Above ₹1000') return price > 1000;
                    return false;
                });
            });
        }

        // Sort
        if (sortBy === 'Price: Low to High') {
            result.sort((a, b) => parseInt(a.price.replace(/[₹,]/g, '')) - parseInt(b.price.replace(/[₹,]/g, '')));
        } else if (sortBy === 'Price: High to Low') {
            result.sort((a, b) => parseInt(b.price.replace(/[₹,]/g, '')) - parseInt(a.price.replace(/[₹,]/g, '')));
        }
        // For 'Bestsellers' or 'New Arrivals', we'll stick to default order or mock logic for now

        return result;
    }, [baseProducts, selectedBrands, selectedPriceRanges, sortBy]);

    return (
        <div className="category-page">
            <div className="breadcrumb">
                <span>Home</span> / <span>{title}</span>
            </div>

            <div className="category-container">
                <aside className="filters-sidebar">
                    <h3>Filters</h3>

                    {/* Dynamic Brand Filter */}
                    {availableBrands.length > 0 && (
                        <div className="filter-group">
                            <h4>Brand</h4>
                            {availableBrands.map(brand => (
                                <label key={brand}>
                                    <input
                                        type="checkbox"
                                        checked={selectedBrands.includes(brand)}
                                        onChange={() => handleBrandChange(brand)}
                                    /> {brand}
                                </label>
                            ))}
                        </div>
                    )}

                    <div className="filter-group">
                        <h4>Price</h4>
                        {['Under ₹500', '₹500 - ₹1000', 'Above ₹1000'].map(range => (
                            <label key={range}>
                                <input
                                    type="checkbox"
                                    checked={selectedPriceRanges.includes(range)}
                                    onChange={() => handlePriceChange(range)}
                                /> {range}
                            </label>
                        ))}
                    </div>
                </aside>

                <main className="category-content">
                    <div className="category-header">
                        <h1>{title}</h1>
                        <div className="sort-options">
                            <span>Sort by: </span>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option>Bestsellers</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>New Arrivals</option>
                            </select>
                        </div>
                    </div>

                    <div className="category-products">
                        {filteredAndSortedProducts.length > 0 ? (
                            <div className="product-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                                {filteredAndSortedProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="no-products">
                                <p>No products match your filters.</p>
                                <button
                                    onClick={() => { setSelectedBrands([]); setSelectedPriceRanges([]); }}
                                    style={{ marginTop: '10px', padding: '8px 16px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CategoryPage;
