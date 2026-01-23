import React, { useState, useEffect } from 'react';
import {
    FiTrendingUp,
    FiTrendingDown,
    FiDollarSign,
    FiShoppingCart,
    FiUsers,
    FiPackage,
    FiDownload,
    FiRefreshCw,
    FiBarChart,
    FiPieChart,
    FiActivity
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
    const [loading, setLoading] = useState(true);
    // Default to current month
    const [dateRange, setDateRange] = useState(() => {
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 1);
        return {
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        };
    });

    const [metrics, setMetrics] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalProducts: 0,
        averageOrderValue: 0,
        conversionRate: 0, // Not currently tracked by backend
        revenueGrowth: 0, // Would require historical data comparison
        orderGrowth: 0    // Would require historical data comparison
    });

    const [chartData, setChartData] = useState({
        revenueChart: [],
        topProducts: [],
        categoryBreakdown: [] // Not currently provided by backend
    });

    useEffect(() => {
        loadAnalytics();
    }, [dateRange]);

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const headers = { 'Authorization': `Bearer ${token}` };

            // Fetch Overview Data
            const overviewResponse = await fetch('http://localhost:5000/api/admin/analytics/overview', { headers });
            const overviewResult = await overviewResponse.json();

            // Fetch Sales Chart Data
            const salesResponse = await fetch(`http://localhost:5000/api/admin/analytics/sales?startDate=${dateRange.start}&endDate=${dateRange.end}`, { headers });
            const salesResult = await salesResponse.json();

            if (overviewResult.success && salesResult.success) {
                const overview = overviewResult.data;
                const salesData = salesResult.data;

                // Process metrics
                const totalRevenue = overview.totalRevenue || 0;
                const totalOrders = overview.totalOrders || 0;
                const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

                setMetrics({
                    totalRevenue,
                    totalOrders,
                    totalCustomers: overview.totalUsers || 0,
                    totalProducts: overview.totalProducts || 0,
                    averageOrderValue: avgOrderValue,
                    conversionRate: 0,
                    revenueGrowth: 0,
                    orderGrowth: 0
                });

                // Process Chart Data
                // Fill in missing dates with 0 values
                const processedRevenueChart = processChartData(salesData, dateRange.start, dateRange.end);

                // Process Top Products
                const processedTopProducts = (overview.topProducts || []).map(p => ({
                    name: p.name,
                    sales: p.totalSold,
                    revenue: p.totalRevenue
                }));

                setChartData({
                    revenueChart: processedRevenueChart,
                    topProducts: processedTopProducts,
                    categoryBreakdown: []
                });
            }
        } catch (error) {
            console.error('Error loading analytics:', error);
            toast.error('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    // Helper to fill in missing dates for the chart
    const processChartData = (data, startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const filledData = [];
        const dataMap = {};

        data.forEach(item => {
            dataMap[item._id] = item;
        });

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            const item = dataMap[dateStr];
            filledData.push({
                date: dateStr,
                revenue: item ? item.totalSales : 0,
                orders: item ? item.count : 0
            });
        }
        return filledData;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatPercentage = (value) => {
        return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
    };

    const exportReport = (type) => {
        // In a real app, this would generate and download reports or call an export endpoint
        toast.success(`${type} report export started`);
    };

    if (loading) {
        return (
            <div className="analytics-dashboard">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="analytics-dashboard">
            <div className="dashboard-header">
                <div className="header-title">
                    <h1>Analytics Dashboard</h1>
                    <p>Track performance metrics and business insights</p>
                </div>
                <div className="header-actions">
                    <div className="date-range-picker">
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            className="date-input"
                        />
                        <span>to</span>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            className="date-input"
                        />
                    </div>
                    <button
                        className="btn btn-secondary"
                        onClick={() => exportReport('Analytics')}
                    >
                        <FiDownload />
                        Export Report
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={loadAnalytics}
                    >
                        <FiRefreshCw />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="metrics-grid">
                <div className="metric-card">
                    <div className="metric-icon revenue">
                        <FiDollarSign />
                    </div>
                    <div className="metric-content">
                        <h3>Total Revenue</h3>
                        <div className="metric-value">{formatCurrency(metrics.totalRevenue)}</div>
                        {/* 
                        <div className={`metric-change ${metrics.revenueGrowth >= 0 ? 'positive' : 'negative'}`}>
                            {metrics.revenueGrowth >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                            {formatPercentage(metrics.revenueGrowth)}
                        </div>
                        */}
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon orders">
                        <FiShoppingCart />
                    </div>
                    <div className="metric-content">
                        <h3>Total Orders</h3>
                        <div className="metric-value">{metrics.totalOrders.toLocaleString()}</div>
                        {/* 
                        <div className={`metric-change ${metrics.orderGrowth >= 0 ? 'positive' : 'negative'}`}>
                            {metrics.orderGrowth >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                            {formatPercentage(metrics.orderGrowth)}
                        </div>
                        */}
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon customers">
                        <FiUsers />
                    </div>
                    <div className="metric-content">
                        <h3>Total Users</h3>
                        <div className="metric-value">{metrics.totalCustomers.toLocaleString()}</div>
                        <div className="metric-change neutral">
                            <FiActivity />
                            Registered
                        </div>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon products">
                        <FiPackage />
                    </div>
                    <div className="metric-content">
                        <h3>Products</h3>
                        <div className="metric-value">{metrics.totalProducts}</div>
                        <div className="metric-change neutral">
                            <FiActivity />
                            Total items
                        </div>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon aov">
                        <FiBarChart />
                    </div>
                    <div className="metric-content">
                        <h3>Avg Order Value</h3>
                        <div className="metric-value">{formatCurrency(metrics.averageOrderValue)}</div>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon conversion">
                        <FiPieChart />
                    </div>
                    <div className="metric-content">
                        <h3>Conversion Rate</h3>
                        <div className="metric-value">--</div>
                        {/* Placeholder as backend doesn't track visits yet */}
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-section">
                <div className="chart-container full-width-chart">
                    <div className="chart-header">
                        <h3>Revenue Trend</h3>
                        <div className="chart-actions">
                            <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => exportReport('Revenue Chart')}
                            >
                                <FiDownload />
                                Export
                            </button>
                        </div>
                    </div>
                    <div className="chart-content">
                        {chartData.revenueChart.length > 0 ? (
                            <div className="simple-chart">
                                {chartData.revenueChart.map((data, index) => {
                                    // Calculate max revenue for scaling
                                    const maxRevenue = Math.max(...chartData.revenueChart.map(d => d.revenue)) || 1;
                                    const heightPercentage = Math.max((data.revenue / maxRevenue) * 100, 5); // min 5% height

                                    return (
                                        <div key={index} className="chart-bar" title={`${data.date}: ${formatCurrency(data.revenue)}`}>
                                            <div
                                                className="bar"
                                                style={{
                                                    height: `${heightPercentage}%`,
                                                    backgroundColor: '#000'
                                                }}
                                            ></div>
                                            <div className="bar-label">
                                                {new Date(data.date).getDate()}
                                            </div>
                                            {/* Hide value if too crowded, show on hover via title */}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="no-data-chart">No sales data for this period</div>
                        )}
                    </div>
                </div>

                {/* Category breakdown suppressed as backend doesn't support it yet */}
            </div>

            {/* Top Products Table */}
            <div className="top-products-section">
                <div className="section-header">
                    <h3>Top Performing Products</h3>
                    <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => exportReport('Top Products')}
                    >
                        <FiDownload />
                        Export
                    </button>
                </div>
                {chartData.topProducts.length > 0 ? (
                    <div className="products-table-container">
                        <table className="products-table">
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Sales</th>
                                    <th>Revenue</th>
                                    <th>Performance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chartData.topProducts.map((product, index) => {
                                    const maxSales = Math.max(...chartData.topProducts.map(p => p.sales)) || 1;
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <div className="product-info">
                                                    <div className="product-rank">#{index + 1}</div>
                                                    <div className="product-name">{product.name}</div>
                                                </div>
                                            </td>
                                            <td className="sales-count">{product.sales}</td>
                                            <td className="revenue-amount">{formatCurrency(product.revenue)}</td>
                                            <td>
                                                <div className="performance-bar">
                                                    <div
                                                        className="performance-fill"
                                                        style={{
                                                            width: `${(product.sales / maxSales) * 100}%`,
                                                            backgroundColor: index === 0 ? '#10b981' : '#6b7280'
                                                        }}
                                                    ></div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="no-data-message">No top products data available</div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-section">
                <h3>Quick Actions</h3>
                <div className="actions-grid">
                    <button
                        className="action-card"
                        onClick={() => exportReport('Full Analytics')}
                    >
                        <FiDownload className="action-icon" />
                        <div className="action-content">
                            <h4>Export Full Report</h4>
                            <p>Download comprehensive analytics report</p>
                        </div>
                    </button>

                    <button
                        className="action-card"
                        onClick={() => exportReport('Sales Summary')}
                    >
                        <FiBarChart className="action-icon" />
                        <div className="action-content">
                            <h4>Sales Summary</h4>
                            <p>Generate sales performance summary</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;