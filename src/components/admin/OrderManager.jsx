import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiEye, FiSearch, FiFilter, FiX } from 'react-icons/fi';
import API_BASE_URL from '../../config';
import './OrderManager.css';

const OrderManager = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterStatus, setFilterStatus] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, [page, filterStatus]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');

            let url = `${API_BASE_URL}/api/admin/orders?page=${page}&limit=10`;
            if (filterStatus) url += `&status=${filterStatus}`;
            if (searchQuery) url += `&search=${searchQuery}`;

            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success) {
                setOrders(data.data);
                setTotalPages(data.totalPages);
            } else {
                toast.error('Failed to fetch orders');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error fetching orders');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchOrders();
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleUpdateStatus = async (newStatus) => {
        if (!selectedOrder) return;

        try {
            setUpdatingStatus(true);
            const token = localStorage.getItem('adminToken');

            const res = await fetch(`${API_BASE_URL}/api/admin/orders/${selectedOrder._id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await res.json();

            if (data.success) {
                toast.success(`Order updated to ${newStatus}`);
                setSelectedOrder(data.data); // Update modal data

                // Update list data locally
                setOrders(prev => prev.map(o =>
                    o._id === selectedOrder._id ? { ...o, status: newStatus } : o
                ));
            } else {
                toast.error(data.error || 'Update failed');
            }
        } catch (error) {
            toast.error('Error updating status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="order-manager">
            <div className="order-manager-header">
                <h1>Order Management</h1>
            </div>

            <div className="filters-bar">
                <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        placeholder="Search by Order ID..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="btn btn-secondary">
                        <FiSearch />
                    </button>
                </form>

                <select
                    className="status-filter"
                    value={filterStatus}
                    onChange={(e) => {
                        setFilterStatus(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* Orders Table */}
            <div className="orders-table-container">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Status</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center' }}>Loading...</td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center' }}>No orders found</td></tr>
                        ) : (
                            orders.map(order => (
                                <tr key={order._id}>
                                    <td className="order-id">#{order.orderNumber?.replace('ORD-', '') || order._id.slice(-6)}</td>
                                    <td>{formatDate(order.createdAt)}</td>
                                    <td className="customer-info">
                                        <div>{order.userId?.firstName} {order.userId?.lastName}</div>
                                        <div>{order.userId?.email}</div>
                                    </td>
                                    <td>
                                        <span className={`status-badge status-${order.status}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>₹{order.totalAmount}</td>
                                    <td>
                                        <button
                                            className="action-btn"
                                            onClick={() => handleViewOrder(order)}
                                            title="View Details"
                                        >
                                            <FiEye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="btn btn-secondary"
                    >
                        Previous
                    </button>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        Page {page} of {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="btn btn-secondary"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Order Details Modal */}
            {isModalOpen && selectedOrder && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Order Details #{selectedOrder.orderNumber}</h2>
                            <button className="action-btn" onClick={() => setIsModalOpen(false)}>
                                <FiX size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="order-details-grid">
                                <div className="detail-section">
                                    <h3>Customer & Shipping</h3>
                                    <div className="address-box">
                                        <strong>{selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}</strong><br />
                                        {selectedOrder.shippingAddress?.address1}<br />
                                        {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postalCode}<br />
                                        {selectedOrder.shippingAddress?.country}<br />
                                        <br />
                                        Phone: {selectedOrder.shippingAddress?.phone}
                                    </div>
                                </div>
                                <div className="detail-section">
                                    <h3>Order Status</h3>
                                    <div className="status-box">
                                        <div style={{ marginBottom: '1rem' }}>
                                            Current Status:
                                            <span className={`status-badge status-${selectedOrder.status}`} style={{ marginLeft: '10px' }}>
                                                {selectedOrder.status}
                                            </span>
                                        </div>

                                        <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Update Status:</label>
                                        <div className="update-status-section">
                                            <select
                                                className="status-filter"
                                                style={{ width: '100%' }}
                                                value={selectedOrder.status}
                                                onChange={(e) => handleUpdateStatus(e.target.value)}
                                                disabled={updatingStatus}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                                <option value="refunded">Refunded</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h3>Order Items</h3>
                            <div className="order-items-list">
                                {selectedOrder.items.map((item, idx) => (
                                    <div key={idx} className="order-item">
                                        <div className="item-details">
                                            <div className="item-name">{item.name || 'Product'} (x{item.quantity})</div>
                                            <div className="item-meta">SKU: {item.productId?.sku || 'N/A'}</div>
                                        </div>
                                        <div className="item-price">₹{item.price * item.quantity}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="order-summary">
                                <div className="summary-row">
                                    <span>Subtotal:</span>
                                    <span>₹{selectedOrder.subtotal}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping:</span>
                                    <span>₹{selectedOrder.shippingCost}</span>
                                </div>
                                <div className="summary-row total">
                                    <span>Total:</span>
                                    <span>₹{selectedOrder.totalAmount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManager;
