import React, { useState, useEffect, useCallback } from 'react';
import {
    FiSearch,
    FiPlus,
    FiEdit,
    FiTrash2,
    FiGrid,
    FiChevronRight,
    FiChevronDown,
    FiTag,
    FiImage,
    FiSave,
    FiX,
    FiMove,
    FiEye,
    FiEyeOff
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useAdminAuth } from '../../context/AdminAuthContext';
import API_BASE_URL from '../../config';
import './CategoryManager.css';

const CategoryManager = () => {
    const { hasPermission } = useAdminAuth();
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState(new Set());

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        parentId: null,
        isActive: true,
        sortOrder: 0,
        image: '',
        attributes: []
    });



    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [categories, searchQuery]);

    const loadCategories = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE_URL}/api/admin/categories`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategories(data.data || []); // Access data.data for standard admin response
            setLoading(false);
        } catch (error) {
            console.error('Error loading categories:', error);
            toast.error('Failed to load categories');
            setLoading(false);
        }
    }, []);

    const applyFilters = useCallback(() => {
        let filtered = [...categories];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(category =>
                category.name.toLowerCase().includes(query) ||
                category.description.toLowerCase().includes(query)
            );
        }

        setFilteredCategories(filtered);
    }, [categories, searchQuery]);

    const toggleExpanded = (categoryId) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    const handleAddCategory = () => {
        if (!hasPermission('categories.write')) {
            toast.error('You do not have permission to add categories');
            return;
        }
        setFormData({
            name: '',
            description: '',
            parentId: null,
            isActive: true,
            sortOrder: 0,
            image: '',
            attributes: []
        });
        setEditingCategory(null);
        setShowAddForm(true);
    };

    const handleEditCategory = (category) => {
        if (!hasPermission('categories.write')) {
            toast.error('You do not have permission to edit categories');
            return;
        }
        setFormData({
            name: category.name,
            description: category.description,
            parentId: category.parentId,
            isActive: category.isActive,
            sortOrder: category.sortOrder,
            image: category.image,
            attributes: category.attributes || []
        });
        setEditingCategory(category);
        setShowAddForm(true);
    };

    const handleDeleteCategory = async (categoryId) => {
        if (!hasPermission('categories.write')) {
            toast.error('You do not have permission to delete categories');
            return;
        }

        if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
            return;
        }

        try {
            // In a real app, this would be an API call
            setCategories(prev => prev.filter(cat => cat.id !== categoryId));
            toast.success('Category deleted successfully');
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error('Failed to delete category');
        }
    };

    const handleSaveCategory = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('Category name is required');
            return;
        }

        try {
            if (editingCategory) {
                // Update existing category
                setCategories(prev => prev.map(cat =>
                    cat.id === editingCategory.id
                        ? { ...cat, ...formData, updatedAt: new Date().toISOString() }
                        : cat
                ));
                toast.success('Category updated successfully');
            } else {
                // Add new category
                const newCategory = {
                    id: Date.now().toString(),
                    ...formData,
                    productCount: 0,
                    children: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                setCategories(prev => [...prev, newCategory]);
                toast.success('Category added successfully');
            }

            setShowAddForm(false);
            setEditingCategory(null);
        } catch (error) {
            console.error('Error saving category:', error);
            toast.error('Failed to save category');
        }
    };

    const toggleCategoryStatus = async (categoryId, currentStatus) => {
        if (!hasPermission('categories.write')) {
            toast.error('You do not have permission to modify categories');
            return;
        }

        try {
            setCategories(prev => prev.map(cat =>
                cat.id === categoryId
                    ? { ...cat, isActive: !currentStatus }
                    : cat
            ));
            toast.success(`Category ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        } catch (error) {
            console.error('Error updating category status:', error);
            toast.error('Failed to update category status');
        }
    };

    const renderCategoryTree = (categoryList, level = 0) => {
        return categoryList.map(category => (
            <div key={category.id} className={`category-item level-${level}`}>
                <div className="category-row">
                    <div className="category-info">
                        <div className="category-toggle">
                            {category.children && category.children.length > 0 && (
                                <button
                                    className="toggle-btn"
                                    onClick={() => toggleExpanded(category.id)}
                                >
                                    {expandedCategories.has(category.id) ?
                                        <FiChevronDown /> : <FiChevronRight />
                                    }
                                </button>
                            )}
                        </div>
                        <div className="category-image">
                            {category.image ? (
                                <img src={category.image} alt={category.name} />
                            ) : (
                                <FiGrid />
                            )}
                        </div>
                        <div className="category-details">
                            <div className="category-name">
                                {category.name}
                                {!category.isActive && <span className="inactive-badge">Inactive</span>}
                            </div>
                            <div className="category-description">{category.description}</div>
                            <div className="category-meta">
                                {category.productCount} products • Sort: {category.sortOrder}
                            </div>
                        </div>
                    </div>
                    <div className="category-actions">
                        <button
                            className="action-btn"
                            onClick={() => toggleCategoryStatus(category.id, category.isActive)}
                            title={category.isActive ? 'Deactivate' : 'Activate'}
                        >
                            {category.isActive ? <FiEye /> : <FiEyeOff />}
                        </button>
                        <button
                            className="action-btn"
                            onClick={() => handleEditCategory(category)}
                            title="Edit Category"
                        >
                            <FiEdit />
                        </button>
                        <button
                            className="action-btn delete"
                            onClick={() => handleDeleteCategory(category.id)}
                            title="Delete Category"
                        >
                            <FiTrash2 />
                        </button>
                    </div>
                </div>
                {category.children && category.children.length > 0 && expandedCategories.has(category.id) && (
                    <div className="category-children">
                        {renderCategoryTree(category.children, level + 1)}
                    </div>
                )}
            </div>
        ));
    };

    if (loading) {
        return (
            <div className="category-manager">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading categories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="category-manager">
            <div className="manager-header">
                <div className="header-left">
                    <h1>Category Management</h1>
                    <p>Organize products into hierarchical categories</p>
                </div>
                <div className="header-actions">
                    <button
                        className="btn btn-primary"
                        onClick={handleAddCategory}
                    >
                        <FiPlus />
                        Add Category
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="filters-section">
                <div className="search-bar">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Categories Tree */}
            <div className="categories-container">
                {filteredCategories.length > 0 ? (
                    <div className="categories-tree">
                        {renderCategoryTree(filteredCategories)}
                    </div>
                ) : (
                    <div className="empty-state">
                        <FiGrid className="empty-icon" />
                        <h3>No categories found</h3>
                        <p>Create your first category to organize products.</p>
                        <button
                            className="btn btn-primary"
                            onClick={handleAddCategory}
                        >
                            <FiPlus />
                            Add Category
                        </button>
                    </div>
                )}
            </div>

            {/* Add/Edit Category Modal */}
            {showAddForm && (
                <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
                    <div className="modal-content category-form-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                            <button
                                className="modal-close"
                                onClick={() => setShowAddForm(false)}
                            >
                                <FiX />
                            </button>
                        </div>

                        <form onSubmit={handleSaveCategory} className="category-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Category Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Enter category name"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Sort Order</label>
                                    <input
                                        type="number"
                                        value={formData.sortOrder}
                                        onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                                        placeholder="0"
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Enter category description"
                                        rows="3"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Parent Category</label>
                                    <select
                                        value={formData.parentId || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value || null }))}
                                    >
                                        <option value="">No Parent (Top Level)</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Image URL</label>
                                    <input
                                        type="url"
                                        value={formData.image}
                                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                        />
                                        <span>Active Category</span>
                                    </label>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowAddForm(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    <FiSave />
                                    {editingCategory ? 'Update Category' : 'Add Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManager;