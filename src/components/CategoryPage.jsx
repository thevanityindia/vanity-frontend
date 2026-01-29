import React from 'react';
import './CategoryPage.css';
import API_BASE_URL from '../config';

import { useParams } from 'react-router-dom';
import ProductCard from './ProductCard';

const formatTitle = (slug) => {
    if (!slug) return '';
    return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const CategoryPage = ({ title }) => {
    const params = useParams();
    const effectiveTitle = title || formatTitle(params.productType || params.subcategory || params.category);

    const [selectedBrands, setSelectedBrands] = React.useState([]);
    const [selectedPriceRanges, setSelectedPriceRanges] = React.useState([]);
    const [sortBy, setSortBy] = React.useState('Bestsellers');
    const [baseProducts, setBaseProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    // Mobile Drawer States
    const [mobileSortOpen, setMobileSortOpen] = React.useState(false);
    const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);

    const [openGroups, setOpenGroups] = React.useState({
        brand: false,
        price: false,
        productType: false,
        products: false,
        function: false,
        finish: false,
        coverage: false
    });

    const toggleGroup = (group) => {
        setOpenGroups(prev => ({
            ...prev,
            [group]: !prev[group]
        }));
    };

    // Fetch products for this category from API
    React.useEffect(() => {
        const fetchCategoryProducts = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE_URL}/api/products?category=${encodeURIComponent(effectiveTitle)}`);
                if (res.ok) {
                    const data = await res.json();
                    setBaseProducts(data.data || []);
                }
            } catch (err) {
                console.error('Error fetching category products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategoryProducts();
    }, [effectiveTitle]);

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
                const price = Number(p.price) || 0;
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
            result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        } else if (sortBy === 'Price: High to Low') {
            result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        }
        // For 'Bestsellers' or 'New Arrivals', we'll stick to default order or mock logic for now

        return result;
    }, [baseProducts, selectedBrands, selectedPriceRanges, sortBy]);

    return (
        <div className="category-page">
            <div className="breadcrumb">
                <span>Home</span> / <span>{effectiveTitle}</span>
            </div>

            <div className="category-container">
                {/* Mobile Sticky Filter/Sort Bar */}
                <div className="mobile-filter-bar">
                    <button className="mobile-filter-btn" onClick={() => setMobileSortOpen(true)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"></path></svg>
                        Recommended
                    </button>
                    <button className="mobile-filter-btn" onClick={() => setMobileFilterOpen(true)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                        Filters
                    </button>
                </div>

                <aside className="filters-sidebar">
                    <button
                        className={`clear-filters-btn ${selectedBrands.length > 0 || selectedPriceRanges.length > 0 ? 'active' : ''}`}
                        onClick={() => { setSelectedBrands([]); setSelectedPriceRanges([]); }}
                    >
                        Clear All Filters
                    </button>

                    <div className={`filter-group ${openGroups.productType ? 'open' : ''}`}>
                        <h4 onClick={() => toggleGroup('productType')}>Product Types</h4>
                        {openGroups.productType && (
                            <div className="filter-content">
                                {/* Add product type filters here if needed */}
                            </div>
                        )}
                    </div>

                    <div className={`filter-group ${openGroups.products ? 'open' : ''}`}>
                        <h4 onClick={() => toggleGroup('products')}>Products</h4>
                        {openGroups.products && (
                            <div className="filter-content">
                                {/* Add product filters here if needed */}
                            </div>
                        )}
                    </div>

                    {/* Dynamic Brand Filter */}
                    {availableBrands.length > 0 && (
                        <div className={`filter-group ${openGroups.brand ? 'open' : ''}`}>
                            <h4 onClick={() => toggleGroup('brand')}>Brands</h4>
                            {openGroups.brand && (
                                <div className="filter-content">
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
                        </div>
                    )}

                    <div className={`filter-group ${openGroups.function ? 'open' : ''}`}>
                        <h4 onClick={() => toggleGroup('function')}>Function</h4>
                        {openGroups.function && (
                            <div className="filter-content">
                                {/* Add function filters here if needed */}
                            </div>
                        )}
                    </div>

                    <div className={`filter-group ${openGroups.finish ? 'open' : ''}`}>
                        <h4 onClick={() => toggleGroup('finish')}>Finish</h4>
                        {openGroups.finish && (
                            <div className="filter-content">
                                {/* Add finish filters here if needed */}
                            </div>
                        )}
                    </div>

                    <div className={`filter-group ${openGroups.coverage ? 'open' : ''}`}>
                        <h4 onClick={() => toggleGroup('coverage')}>Coverage</h4>
                        {openGroups.coverage && (
                            <div className="filter-content">
                                {/* Add coverage filters here if needed */}
                            </div>
                        )}
                    </div>

                    <div className={`filter-group ${openGroups.price ? 'open' : ''}`}>
                        <h4 onClick={() => toggleGroup('price')}>Price</h4>
                        {openGroups.price && (
                            <div className="filter-content">
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
                        )}
                    </div>
                </aside>

                <main className="category-content">
                    <div className="category-header">
                        <h1>{effectiveTitle} <span>({filteredAndSortedProducts.length} items)</span></h1>
                        <div className="sort-options">
                            <span>Sort:</span>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option>Recommended</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>New Arrivals</option>
                            </select>
                        </div>
                    </div>

                    <div className="category-products">
                        {filteredAndSortedProducts.length > 0 ? (
                            <div className="product-grid">
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

            {/* Mobile Sort Drawer */}
            {mobileSortOpen && (
                <div className="mobile-drawer-overlay" onClick={() => setMobileSortOpen(false)}>
                    <div className="mobile-drawer-content" onClick={e => e.stopPropagation()}>
                        <div className="drawer-header">
                            <h3>Sort By</h3>
                            <button onClick={() => setMobileSortOpen(false)}>✕</button>
                        </div>
                        <div className="drawer-body">
                            {['Recommended', 'Price: Low to High', 'Price: High to Low', 'New Arrivals'].map(option => (
                                <div
                                    key={option}
                                    className={`sort-option-item ${sortBy === option ? 'selected' : ''}`}
                                    onClick={() => { setSortBy(option); setMobileSortOpen(false); }}
                                >
                                    {option}
                                    {sortBy === option && <span>✓</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Filter Drawer */}
            {mobileFilterOpen && (
                <div className="mobile-drawer-overlay" onClick={() => setMobileFilterOpen(false)}>
                    <div className="mobile-drawer-content full-height" onClick={e => e.stopPropagation()}>
                        <div className="drawer-header">
                            <h3>Filters</h3>
                            <button onClick={() => setMobileFilterOpen(false)}>✕</button>
                        </div>
                        <div className="drawer-body scrollable">
                            {/* Reusing Filter Groups Logic */}
                            {availableBrands.length > 0 && (
                                <div className={`filter-group mobile open`}>
                                    <h4>Brands</h4>
                                    <div className="filter-content">
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
                                </div>
                            )}

                            <div className={`filter-group mobile open`}>
                                <h4>Price</h4>
                                <div className="filter-content">
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
                            </div>
                        </div>
                        <div className="drawer-footer">
                            <button className="clear-btn" onClick={() => { setSelectedBrands([]); setSelectedPriceRanges([]); }}>Clear All</button>
                            <button className="apply-btn" onClick={() => setMobileFilterOpen(false)}>Apply</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
