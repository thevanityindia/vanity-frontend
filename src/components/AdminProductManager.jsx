import React, { useState, useEffect } from 'react';
import './AdminProductManager.css';
import { toast } from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5000/api';

const CATEGORIES = [
    'Makeup',
    'Skincare',
    'Hair',
    'Fragrance',
    'Bath & Body',
    'Artificial Jewellery',
    'Brands',
    'New Arrivals'
];

const SUBCATEGORIES = {
    'Makeup': ['Foundation', 'Concealer', 'Blush', 'Lipstick', 'Eyeshadow', 'Mascara', 'Eyeliner'],
    'Skincare': ['Cleanser', 'Moisturizer', 'Serum', 'Sunscreen', 'Toner', 'Face Mask'],
    'Hair': ['Shampoo', 'Conditioner', 'Hair Oil', 'Styling Products', 'Hair Mask'],
    'Fragrance': ['Perfume', 'Body Spray', 'Deodorant'],
    'Bath & Body': ['Body Wash', 'Body Lotion', 'Body Scrub', 'Hand Cream'],
    'Artificial Jewellery': ['Earrings', 'Necklaces', 'Bracelets', 'Rings'],
    'Brands': [],
    'New Arrivals': []
};

const AdminProductManager = () => {
    const [products, setProducts] = useState([]);
    const [filterCategory, setFilterCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('all'); // 'all' or 'category'

    // Form State
    const [formData, setFormData] = useState({
        brand: '',
        name: '',
        price: '',
        image: '',
        category: '',
        subcategory: '',
        description: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/products`);
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.brand || !formData.name || !formData.price || !formData.image || !formData.category) {
            toast.error('Please fill in all required fields including category');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Product added successfully!');
                setFormData({
                    brand: '',
                    name: '',
                    price: '',
                    image: '',
                    category: '',
                    subcategory: '',
                    description: ''
                });
                fetchProducts(); // Refresh list
            } else {
                toast.error(result.message || 'Failed to add product');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error('Error adding product');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Product deleted');
                // Optimistic update or refetch
                setProducts(prev => prev.filter(p => p.id !== id));
            } else {
                toast.error(result.message || 'Failed to delete');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Error deleting product');
        }
    };

    // Filter products based on category selection
    const filteredProducts = filterCategory
        ? products.filter(p => p.category?.toLowerCase() === filterCategory.toLowerCase())
        : products;

    // Group products by category for category view
    const productsByCategory = products.reduce((acc, product) => {
        const category = product.category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(product);
        return acc;
    }, {});

    const handleCategorySelect = (category) => {
        setFilterCategory(category);
    };

    const getAvailableSubcategories = () => {
        return SUBCATEGORIES[formData.category] || [];
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Product Management</h1>
                <p>Add, remove, and manage your inventory by category</p>
            </div>

            {/* View Mode Toggle */}
            <div className="view-mode-toggle">
                <button 
                    className={`toggle-btn ${viewMode === 'all' ? 'active' : ''}`}
                    onClick={() => setViewMode('all')}
                >
                    All Products
                </button>
                <button 
                    className={`toggle-btn ${viewMode === 'category' ? 'active' : ''}`}
                    onClick={() => setViewMode('category')}
                >
                    Category View
                </button>
            </div>

            <div className="admin-form-card">
                <h2>Add New Product</h2>
                <form onSubmit={handleSubmit} className="form-grid">
                    <div className="form-group">
                        <label>Brand Name *</label>
                        <input
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={handleInputChange}
                            placeholder="e.g. Rare Beauty"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Product Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g. Soft Pinch Liquid Blush"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Price *</label>
                        <input
                            type="text"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="e.g. ₹ 2,400"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Category *</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Category</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {formData.category && getAvailableSubcategories().length > 0 && (
                        <div className="form-group">
                            <label>Subcategory</label>
                            <select
                                name="subcategory"
                                value={formData.subcategory}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Subcategory</option>
                                {getAvailableSubcategories().map(subcat => (
                                    <option key={subcat} value={subcat}>{subcat}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>Image URL *</label>
                        <input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleInputChange}
                            placeholder="https://..."
                            required
                        />
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Product description..."
                            rows="3"
                        />
                    </div>

                    <button type="submit" className="submit-btn">Add Product</button>
                </form>
            </div>

            {viewMode === 'all' ? (
                <div className="product-list-section">
                    <div className="filter-bar">
                        <h2>Current Inventory ({filteredProducts.length})</h2>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="category-filter"
                        >
                            <option value="">All Categories</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="products-table-container">
                        {loading ? (
                            <p>Loading products...</p>
                        ) : (
                            <table className="products-table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Details</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map(product => (
                                        <tr key={product.id} className="product-row">
                                            <td className="product-image-cell">
                                                <img src={product.image} alt={product.name} />
                                            </td>
                                            <td>
                                                <strong>{product.brand}</strong>
                                                <br />
                                                <span style={{ color: '#666', fontSize: '0.9em' }}>{product.name}</span>
                                                {product.subcategory && (
                                                    <><br /><span style={{ color: '#999', fontSize: '0.8em' }}>{product.subcategory}</span></>
                                                )}
                                            </td>
                                            <td>
                                                {product.category || <span style={{ color: '#aaa' }}>-</span>}
                                            </td>
                                            <td>{product.price}</td>
                                            <td>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredProducts.length === 0 && (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                                                No products found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            ) : (
                <div className="category-view-section">
                    <h2>Products by Category</h2>
                    <div className="category-grid">
                        {CATEGORIES.map(category => {
                            const categoryProducts = productsByCategory[category] || [];
                            return (
                                <div key={category} className="category-card">
                                    <div className="category-header">
                                        <h3>{category}</h3>
                                        <span className="product-count">{categoryProducts.length} products</span>
                                    </div>
                                    <div className="category-products">
                                        {categoryProducts.length === 0 ? (
                                            <p className="no-products">No products in this category</p>
                                        ) : (
                                            categoryProducts.slice(0, 3).map(product => (
                                                <div key={product.id} className="mini-product-card">
                                                    <img src={product.image} alt={product.name} />
                                                    <div className="mini-product-info">
                                                        <span className="mini-brand">{product.brand}</span>
                                                        <span className="mini-name">{product.name}</span>
                                                        <span className="mini-price">{product.price}</span>
                                                    </div>
                                                    <button
                                                        className="mini-delete-btn"
                                                        onClick={() => handleDelete(product.id)}
                                                        title="Delete product"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                        {categoryProducts.length > 3 && (
                                            <button 
                                                className="view-all-btn"
                                                onClick={() => {
                                                    setViewMode('all');
                                                    handleCategorySelect(category);
                                                }}
                                            >
                                                View all {categoryProducts.length} products
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProductManager;
