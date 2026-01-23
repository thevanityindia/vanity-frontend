import React, { useState, useEffect, useCallback } from 'react';
import {
    FiSearch,
    FiFilter,
    FiPlus,
    FiEdit,
    FiTrash2,
    FiGrid,
    FiList,
    FiMoreVertical,
    FiCheckSquare,
    FiSquare,
    FiImage,
    FiUpload,
    FiX,
    FiSave,
    FiDownload,
    FiRefreshCw
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useAdminAuth } from '../../context/AdminAuthContext';
import './EnhancedProductManager.css';

const EnhancedProductManager = () => {
    const { hasPermission } = useAdminAuth();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
    const [selectedProducts, setSelectedProducts] = useState(new Set());
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [categories, setCategories] = useState([]);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        status: '', // active, draft, archived
        stockStatus: '' // in_stock, out_of_stock, low_stock
    });

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        images: [],
        isPublic: true,
        sku: '',
        attributes: []
    });

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [products, searchQuery, filters]);

    const loadProducts = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:5000/api/admin/products?limit=100', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to load products');

            const data = await response.json();
            setProducts(data.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error loading products:', error);
            toast.error('Failed to load products');
            setLoading(false);
        }
    }, []);

    const loadCategories = useCallback(async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:5000/api/admin/categories', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setCategories(data.data || []);
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }, []);

    const applyFilters = () => {
        let filtered = [...products];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.brand?.toLowerCase().includes(query) ||
                p.sku?.toLowerCase().includes(query)
            );
        }

        if (filters.category) {
            filtered = filtered.filter(p => p.category === filters.category);
        }

        if (filters.status === 'active') {
            filtered = filtered.filter(p => p.isPublic);
        } else if (filters.status === 'draft') {
            filtered = filtered.filter(p => !p.isPublic);
        }

        setFilteredProducts(filtered);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedProducts(new Set(filteredProducts.map(p => p._id)));
        } else {
            setSelectedProducts(new Set());
        }
    };

    const handleSelectProduct = (id) => {
        const newSelected = new Set(selectedProducts);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedProducts(newSelected);
    };

    const handleDelete = async (id) => {
        if (!hasPermission('products.delete')) {
            toast.error('Permission denied');
            return;
        }
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:5000/api/admin/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setProducts(prev => prev.filter(p => p._id !== id));
                toast.success('Product deleted');
            } else {
                throw new Error('Failed to delete');
            }
        } catch (error) {
            toast.error('Error deleting product');
        }
    };

    const handleBulkDelete = async () => {
        if (!hasPermission('products.delete')) {
            toast.error('Permission denied');
            return;
        }
        if (!window.confirm(`Delete ${selectedProducts.size} products?`)) return;

        // In a real app, use a bulk delete endpoint. For now, we'll loop (inefficient but works for small batches)
        const token = localStorage.getItem('adminToken');
        let successCount = 0;

        for (const id of selectedProducts) {
            try {
                await fetch(`http://localhost:5000/api/admin/products/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                successCount++;
            } catch (e) { console.error(e); }
        }

        loadProducts();
        setSelectedProducts(new Set());
        toast.success(`Deleted ${successCount} products`);
    };

    const handleOpenAddModal = () => {
        setEditingProduct(null);
        setFormData({
            name: '', brand: '', description: '', price: '', category: '',
            stock: 0, images: [], isPublic: true, sku: '', attributes: []
        });
        setShowAddModal(true);
    };

    const handleOpenEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            brand: product.brand || '',
            description: product.description || '',
            price: product.price,
            category: product.category, // Assuming simple string or object with name
            stock: product.stock || 0,
            images: product.images || [],
            isPublic: product.isPublic,
            sku: product.sku || '',
            attributes: product.attributes || []
        });
        setShowAddModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        const url = editingProduct
            ? `http://localhost:5000/api/admin/products/${editingProduct._id}`
            : 'http://localhost:5000/api/admin/products';

        const method = editingProduct ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Operation failed');

            const result = await response.json();

            if (editingProduct) {
                setProducts(prev => prev.map(p => p._id === editingProduct._id ? result.data : p));
                toast.success('Product updated');
            } else {
                setProducts(prev => [result.data, ...prev]);
                toast.success('Product created');
            }
            setShowAddModal(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to save product');
        }
    };

    if (loading) return <div className="loading-state"><div className="loading-spinner"></div>Loading...</div>;

    return (
        <div className="enhanced-product-manager">
            {/* Header */}
            <div className="manager-header">
                <div className="header-left">
                    <h1>Products</h1>
                    <p>Manage your product catalog</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={loadProducts}><FiRefreshCw /> Refresh</button>
                    <button className="btn btn-primary" onClick={handleOpenAddModal}><FiPlus /> Add Product</button>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-section">
                <div className="search-bar">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="filters">
                    <select value={filters.category} onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}>
                        <option value="">All Categories</option>
                        {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                    </select>
                    <select value={filters.status} onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}>
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                    </select>
                    <div className="view-toggle">
                        <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}><FiGrid /></button>
                        <button className={`view-btn ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}><FiList /></button>
                    </div>
                </div>
            </div>

            {selectedProducts.size > 0 && (
                <div className="bulk-actions">
                    <div className="bulk-info">
                        <FiCheckSquare /> {selectedProducts.size} Selected
                    </div>
                    <div className="bulk-buttons">
                        <button className="btn btn-danger btn-sm" onClick={handleBulkDelete}>
                            <FiTrash2 /> Delete Selected
                        </button>
                    </div>
                </div>
            )}

            {/* Content */}
            {filteredProducts.length === 0 ? (
                <div className="empty-state">
                    <h3>No products found</h3>
                    <p>Try adjusting your search or add a new product.</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="products-grid">
                    {filteredProducts.map(product => (
                        <div key={product._id} className={`product-card ${selectedProducts.has(product._id) ? 'selected' : ''}`}>
                            <div className="card-header">
                                <input
                                    type="checkbox"
                                    checked={selectedProducts.has(product._id)}
                                    onChange={() => handleSelectProduct(product._id)}
                                    className="product-checkbox"
                                />
                                <div className={`status-badge ${product.isPublic ? 'active' : 'draft'}`}>
                                    {product.isPublic ? 'Active' : 'Draft'}
                                </div>
                            </div>
                            <div className="card-image">
                                {product.images?.[0] ? <img src={product.images[0]} alt={product.name} /> : <FiImage className="image-placeholder" />}
                            </div>
                            <div className="card-content">
                                <div className="product-brand">{product.brand}</div>
                                <div className="product-name">{product.name}</div>
                                <div className="product-price">₹{product.price}</div>
                                <div className="product-meta">
                                    <span className="category">{product.category}</span>
                                    <span className="stock">Stock: {product.stock || 0}</span>
                                </div>
                                <div className="card-actions visible">
                                    <button className="action-btn edit" onClick={() => handleOpenEditModal(product)}><FiEdit /></button>
                                    <button className="action-btn delete" onClick={() => handleDelete(product._id)}><FiTrash2 /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="products-table-container">
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>
                                    <input type="checkbox" onChange={handleSelectAll} checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0} />
                                </th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product._id} className={selectedProducts.has(product._id) ? 'selected' : ''}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedProducts.has(product._id)}
                                            onChange={() => handleSelectProduct(product._id)}
                                        />
                                    </td>
                                    <td>
                                        <div className="table-image">
                                            {product.images?.[0] ? <img src={product.images[0]} alt={product.name} /> : <FiImage />}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="product-info">
                                            <div className="product-name">{product.name}</div>
                                            <div className="product-brand">{product.brand}</div>
                                        </div>
                                    </td>
                                    <td>{product.category}</td>
                                    <td className="price">₹{product.price}</td>
                                    <td>{product.stock || 0}</td>
                                    <td>
                                        <span className={`status-badge ${product.isPublic ? 'active' : 'draft'}`}>
                                            {product.isPublic ? 'Active' : 'Draft'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="action-btn edit" onClick={() => handleOpenEditModal(product)}><FiEdit /></button>
                                            <button className="action-btn delete" onClick={() => handleDelete(product._id)}><FiTrash2 /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="product-form-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingProduct ? 'Edit Product' : 'New Product'}</h2>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}><FiX /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="product-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Name</label>
                                    <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Brand</label>
                                    <input value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Price (₹)</label>
                                    <input type="number" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Stock</label>
                                    <input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>SKU</label>
                                    <input value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} />
                                </div>
                                <div className="form-group full-width">
                                    <label>Description</label>
                                    <textarea rows="4" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                </div>
                                <div className="form-group full-width">
                                    <label>Image URL (First Image)</label>
                                    <input
                                        type="text"
                                        placeholder="Enter image URL"
                                        value={formData.images[0] || ''}
                                        onChange={e => setFormData({ ...formData, images: [e.target.value] })}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label className="checkbox-label">
                                        <input type="checkbox" checked={formData.isPublic} onChange={e => setFormData({ ...formData, isPublic: e.target.checked })} />
                                        Public (Visible to customers)
                                    </label>
                                </div>
                            </div>
                            <div className="form-actions" style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary"><FiSave /> Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnhancedProductManager;
