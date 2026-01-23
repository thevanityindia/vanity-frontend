import React, { useState, useEffect } from 'react';
import { FiUsers, FiShoppingBag, FiDollarSign, FiPackage, FiActivity, FiArrowUp, FiArrowDown, FiClock, FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalProducts: 0,
        recentOrders: [],
        topProducts: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch('http://localhost:5000/api/admin/analytics/overview', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        setStats(result.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="admin-dashboard-loading">
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h2>Overview</h2>
                <div className="date-range">Last 30 Days</div>
            </div>

            <div className="stats-grid">
                <div className="stat-card revenue">
                    <div className="stat-icon">
                        <FiDollarSign />
                    </div>
                    <div className="stat-info">
                        <h3>Total Revenue</h3>
                        <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
                        <div className="stat-trend positive">
                            <FiArrowUp /> 12.5% <span>vs last month</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card orders">
                    <div className="stat-icon">
                        <FiShoppingBag />
                    </div>
                    <div className="stat-info">
                        <h3>Total Orders</h3>
                        <div className="stat-value">{stats.totalOrders}</div>
                        <div className="stat-trend positive">
                            <FiArrowUp /> 8.2% <span>vs last month</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card users">
                    <div className="stat-icon">
                        <FiUsers />
                    </div>
                    <div className="stat-info">
                        <h3>Total Users</h3>
                        <div className="stat-value">{stats.totalUsers}</div>
                        <div className="stat-trend positive">
                            <FiArrowUp /> 5.3% <span>vs last month</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card products">
                    <div className="stat-icon">
                        <FiPackage />
                    </div>
                    <div className="stat-info">
                        <h3>Products</h3>
                        <div className="stat-value">{stats.totalProducts}</div>
                        <div className="stat-trend negative">
                            <FiActivity /> Active
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-content-grid">
                <div className="recent-orders-section">
                    <div className="section-header">
                        <h3>Recent Orders</h3>
                        <Link to="/admin/orders" className="view-all-link">View All</Link>
                    </div>
                    {stats.recentOrders && stats.recentOrders.length > 0 ? (
                        <div className="table-responsive">
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentOrders.map(order => (
                                        <tr key={order._id}>
                                            <td>#{order.orderNumber || order._id.slice(-6).toUpperCase()}</td>
                                            <td>{order.user?.name || 'Guest'}</td>
                                            <td>{formatDate(order.createdAt)}</td>
                                            <td>{formatCurrency(order.totalAmount)}</td>
                                            <td>
                                                <span className={`status-badge ${order.status.toLowerCase()}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <FiShoppingBag size={48} />
                            <p>No recent orders found</p>
                        </div>
                    )}
                </div>

                <div className="top-products-section">
                    <div className="section-header">
                        <h3>Top Products</h3>
                        <Link to="/admin/analytics" className="view-all-link">View Reports</Link>
                    </div>
                    {stats.topProducts && stats.topProducts.length > 0 ? (
                        <div className="top-products-list">
                            {stats.topProducts.map((product, index) => (
                                <div key={product._id} className="top-product-item">
                                    <div className="product-rank">{index + 1}</div>
                                    <div className="product-details">
                                        <h4>{product.name}</h4>
                                        <p>{product.totalSold} sold</p>
                                    </div>
                                    <div className="product-revenue">
                                        {formatCurrency(product.totalRevenue)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <FiPackage size={48} />
                            <p>No sales data yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;