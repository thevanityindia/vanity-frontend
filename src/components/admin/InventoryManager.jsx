import React, { useState, useEffect, useCallback } from 'react';
import {
    FiSearch,
    FiFilter,
    FiPackage,
    FiAlertTriangle,
    FiTrendingUp,
    FiTrendingDown,
    FiEdit,
    FiPlus,
    FiMinus,
    FiRefreshCw,
    FiDownload,
    FiEye,
    FiBarChart,
    FiClock,
    FiCheckCircle,
    FiXCircle
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useAdminAuth } from '../../context/AdminAuthContext';
import API_BASE_URL from '../../config';
import './InventoryManager.css';

const InventoryManager = () => {
    const { hasPermission } = useAdminAuth();
    const [inventory, setInventory] = useState([]);
    const [filteredInventory, setFilteredInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        category: '',
        lowStock: false
    });
    const [showAdjustModal, setShowAdjustModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [adjustmentData, setAdjustmentData] = useState({
        type: 'add', // add, remove, set
        quantity: '',
        reason: '',
        notes: ''
    });



    const statusConfig = {
        in_stock: { label: 'In Stock', color: '#10b981', icon: FiCheckCircle },
        low_stock: { label: 'Low Stock', color: '#f59e0b', icon: FiAlertTriangle },
        out_of_stock: { label: 'Out of Stock', color: '#ef4444', icon: FiXCircle },
        discontinued: { label: 'Discontinued', color: '#6b7280', icon: FiXCircle }
    };

    const loadInventory = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE_URL}/api/admin/inventory`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch inventory');
            }
            const data = await response.json();
            setInventory(data.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error loading inventory:', error);
            toast.error('Failed to load inventory');
            setLoading(false);
        }
    }, []);

    // ... (applyFilters and other handlers remain the same)

    // ... (useEffect hooks match original)

    // ... (handleStockAdjustment, processStockAdjustment, exportInventory, formatters remain same)

    // ... (getStockStatus, getStockPercentage remain same)

    // ... (loading check)

    // ... (summary stats calc)

    // ... (render logic until sync button)

    return (
        <div className="inventory-manager">
            <div className="manager-header">
                <div className="header-left">
                    <h1>Inventory Management</h1>
                    <p>Track stock levels, manage inventory, and monitor alerts</p>
                </div>
                <div className="header-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={exportInventory}
                    >
                        <FiDownload />
                        Export
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={loadInventory}
                    >
                        Refresh
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={async () => {
                            try {
                                const token = localStorage.getItem('adminToken');
                                const res = await fetch(`${API_BASE_URL}/api/admin/inventory/sync`, {
                                    method: 'POST',
                                    headers: { 'Authorization': `Bearer ${token}` }
                                });
                                const data = await res.json();
                                if (data.success) {
                                    toast.success(data.message);
                                    loadInventory();
                                } else {
                                    toast.error('Sync failed');
                                }
                            } catch (e) {
                                toast.error('Sync error');
                            }
                        }}
                    >
                        <FiRefreshCw />
                        Sync Products
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="summary-cards">
                <div className="summary-card">
                    <div className="card-icon total">
                        <FiPackage />
                    </div>
                    <div className="card-content">
                        <h3>Total Items</h3>
                        <div className="card-value">{totalItems}</div>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="card-icon value">
                        <FiBarChart />
                    </div>
                    <div className="card-content">
                        <h3>Total Value</h3>
                        <div className="card-value">{formatCurrency(totalValue)}</div>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="card-icon warning">
                        <FiAlertTriangle />
                    </div>
                    <div className="card-content">
                        <h3>Low Stock</h3>
                        <div className="card-value">{lowStockItems}</div>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="card-icon danger">
                        <FiXCircle />
                    </div>
                    <div className="card-content">
                        <h3>Out of Stock</h3>
                        <div className="card-value">{outOfStockItems}</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-section">
                <div className="search-bar">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by product name, SKU, or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="filters">
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    >
                        <option value="">All Status</option>
                        <option value="in_stock">In Stock</option>
                        <option value="low_stock">Low Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                    </select>

                    <select
                        value={filters.category}
                        onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    >
                        <option value="">All Categories</option>
                        <option value="Makeup">Makeup</option>
                        <option value="Skincare">Skincare</option>
                        <option value="Fragrance">Fragrance</option>
                    </select>

                    <label className="checkbox-filter">
                        <input
                            type="checkbox"
                            checked={filters.lowStock}
                            onChange={(e) => setFilters(prev => ({ ...prev, lowStock: e.target.checked }))}
                        />
                        <span>Low Stock Only</span>
                    </label>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="inventory-container">
                {filteredInventory.length > 0 ? (
                    <div className="inventory-table-container">
                        <table className="inventory-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>SKU</th>
                                    <th>Category</th>
                                    <th>Stock Level</th>
                                    <th>Status</th>
                                    <th>Value</th>
                                    <th>Last Updated</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInventory.map(item => {
                                    const status = statusConfig[item.status];
                                    const StatusIcon = status.icon;
                                    const stockPercentage = getStockPercentage(item.currentStock, item.maxStock);

                                    return (
                                        <tr key={item.id} className={`inventory-row ${item.status}`}>
                                            <td>
                                                <div className="product-info">
                                                    <div className="product-name">{item.productName}</div>
                                                    <div className="product-location">{item.location}</div>
                                                </div>
                                            </td>
                                            <td className="sku">{item.sku}</td>
                                            <td className="category">{item.category}</td>
                                            <td>
                                                <div className="stock-info">
                                                    <div className="stock-numbers">
                                                        <span className="current-stock">{item.currentStock}</span>
                                                        <span className="stock-separator">/</span>
                                                        <span className="max-stock">{item.maxStock}</span>
                                                    </div>
                                                    <div className="stock-bar">
                                                        <div
                                                            className="stock-fill"
                                                            style={{
                                                                width: `${stockPercentage}%`,
                                                                backgroundColor: status.color
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <div className="stock-details">
                                                        Available: {item.availableStock} | Reserved: {item.reservedStock}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="status-badge" style={{ color: status.color }}>
                                                    <StatusIcon />
                                                    {status.label}
                                                </div>
                                            </td>
                                            <td className="value">{formatCurrency(item.totalValue)}</td>
                                            <td className="last-updated">{formatDate(item.lastUpdated)}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="action-btn"
                                                        onClick={() => handleStockAdjustment(item)}
                                                        title="Adjust Stock"
                                                    >
                                                        <FiEdit />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state">
                        <FiPackage className="empty-icon" />
                        <h3>No inventory items found</h3>
                        <p>No items match your current search and filter criteria.</p>
                    </div>
                )}
            </div>

            {/* Stock Adjustment Modal */}
            {showAdjustModal && selectedItem && (
                <div className="modal-overlay" onClick={() => setShowAdjustModal(false)}>
                    <div className="modal-content adjustment-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Adjust Stock - {selectedItem.productName}</h2>
                            <button
                                className="modal-close"
                                onClick={() => setShowAdjustModal(false)}
                            >
                                <FiX />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="current-stock-info">
                                <div className="stock-item">
                                    <label>Current Stock:</label>
                                    <span>{selectedItem.currentStock}</span>
                                </div>
                                <div className="stock-item">
                                    <label>Available:</label>
                                    <span>{selectedItem.availableStock}</span>
                                </div>
                                <div className="stock-item">
                                    <label>Reserved:</label>
                                    <span>{selectedItem.reservedStock}</span>
                                </div>
                            </div>

                            <div className="adjustment-form">
                                <div className="form-group">
                                    <label>Adjustment Type</label>
                                    <select
                                        value={adjustmentData.type}
                                        onChange={(e) => setAdjustmentData(prev => ({ ...prev, type: e.target.value }))}
                                    >
                                        <option value="add">Add Stock</option>
                                        <option value="remove">Remove Stock</option>
                                        <option value="set">Set Stock Level</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Quantity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={adjustmentData.quantity}
                                        onChange={(e) => setAdjustmentData(prev => ({ ...prev, quantity: e.target.value }))}
                                        placeholder="Enter quantity"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Reason *</label>
                                    <select
                                        value={adjustmentData.reason}
                                        onChange={(e) => setAdjustmentData(prev => ({ ...prev, reason: e.target.value }))}
                                    >
                                        <option value="">Select reason</option>
                                        <option value="Restock">Restock</option>
                                        <option value="Damaged">Damaged Items</option>
                                        <option value="Lost">Lost Items</option>
                                        <option value="Returned">Customer Return</option>
                                        <option value="Correction">Inventory Correction</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Notes</label>
                                    <textarea
                                        value={adjustmentData.notes}
                                        onChange={(e) => setAdjustmentData(prev => ({ ...prev, notes: e.target.value }))}
                                        placeholder="Additional notes (optional)"
                                        rows="3"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowAdjustModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={processStockAdjustment}
                            >
                                Apply Adjustment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryManager;
