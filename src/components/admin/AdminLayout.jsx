import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import API_BASE_URL from '../../config';
import './AdminLayout.css';

const AdminLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { adminUser, isAdminAuthenticated, adminLogout } = useAdminAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Stats/Badges State
    const [badges, setBadges] = useState({
        orders: 0,
        inventory: 0,
        notifications: 0
    });

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAdminAuthenticated) {
            navigate('/admin/login');
        }
    }, [isAdminAuthenticated, navigate]);

    // Fetch realtime counts for sidebar badges
    useEffect(() => {
        if (!isAdminAuthenticated) return;

        const fetchBadgeCounts = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const headers = { 'Authorization': `Bearer ${token}` };

                // Parallel fetching for performance
                const [ordersRes, inventoryRes, notificationsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/admin/orders?status=Pending&limit=1`, { headers }),
                    fetch(`${API_BASE_URL}/api/admin/inventory/low-stock?limit=1`, { headers }),
                    fetch(`${API_BASE_URL}/api/admin/notifications?read=false&limit=1`, { headers })
                ]);

                const ordersData = await ordersRes.json();
                const inventoryData = await inventoryRes.json();
                const notificationsData = await notificationsRes.json();

                setBadges({
                    orders: ordersData.success ? (ordersData.total || ordersData.count || 0) : 0,
                    inventory: inventoryData.success ? (inventoryData.total || inventoryData.count || 0) : 0,
                    notifications: notificationsData.success ? (notificationsData.total || notificationsData.count || notificationsData.data?.length || 0) : 0
                });

            } catch (error) {
                console.error('Error fetching admin badges:', error);
            }
        };

        fetchBadgeCounts();
        // Poll every 30 seconds
        const interval = setInterval(fetchBadgeCounts, 30000);
        return () => clearInterval(interval);

    }, [isAdminAuthenticated]);

    const handleLogout = () => {
        adminLogout();
        navigate('/admin/login');
    };

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const getCurrentSection = () => {
        const path = location.pathname;
        if (path.includes('/dashboard')) return 'dashboard';
        if (path.includes('/products')) return 'products';
        if (path.includes('/users')) return 'users';
        if (path.includes('/orders')) return 'orders';
        if (path.includes('/analytics')) return 'analytics';
        if (path.includes('/categories')) return 'categories';
        if (path.includes('/inventory')) return 'inventory';
        if (path.includes('/content')) return 'content';
        if (path.includes('/settings')) return 'settings';
        return 'dashboard';
    };

    if (!isAdminAuthenticated) {
        return null;
    }

    return (
        <div className="admin-layout">
            <AdminSidebar
                collapsed={sidebarCollapsed}
                currentSection={getCurrentSection()}
                badges={badges}
            />

            <div className={`admin-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <AdminHeader
                    user={adminUser}
                    onToggleSidebar={toggleSidebar}
                    onLogout={handleLogout}
                />

                <div className="admin-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;