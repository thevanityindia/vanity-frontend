import React, { useState, useEffect } from 'react';
import { FiMenu, FiBell, FiUser, FiLogOut, FiSettings, FiRefreshCw } from 'react-icons/fi';
import { useAdminAuth } from '../../context/AdminAuthContext';
import API_BASE_URL from '../../config';
import './AdminHeader.css';

const AdminHeader = ({ user, onToggleSidebar, onLogout }) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const { refreshSession } = useAdminAuth();

    const fetchNotifications = async () => {
        try {
            setLoadingNotifications(true);
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE_URL}/api/admin/notifications?read=false`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setNotifications(result.data);
                }
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoadingNotifications(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll for notifications every minute
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('adminToken');
            await fetch(`${API_BASE_URL}/api/admin/notifications/${id}/read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Remove from local state
            setNotifications(prev => prev.filter(n => n._id !== id));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleRefreshSession = () => {
        refreshSession();
        fetchNotifications();
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    return (
        <header className="admin-header">
            <div className="header-left">
                <button
                    className="sidebar-toggle"
                    onClick={onToggleSidebar}
                    aria-label="Toggle sidebar"
                >
                    <FiMenu />
                </button>

                <div className="header-title">
                    <h1>Admin Dashboard</h1>
                    <span className="header-subtitle">Manage your e-commerce platform</span>
                </div>
            </div>

            <div className="header-right">
                <button
                    className="header-action-btn"
                    onClick={handleRefreshSession}
                    title="Refresh Session"
                >
                    <FiRefreshCw />
                </button>

                <div className="notifications-container">
                    <button
                        className="header-action-btn notifications-btn"
                        onClick={() => setShowNotifications(!showNotifications)}
                        aria-label="Notifications"
                    >
                        <FiBell />
                        {notifications.length > 0 && (
                            <span className="notification-badge">{notifications.length}</span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="notifications-dropdown">
                            <div className="notifications-header">
                                <h3>Notifications</h3>
                                <div className="notifications-actions">
                                    <span className="notifications-count">{notifications.length} unread</span>
                                    <button onClick={fetchNotifications} className="refresh-icon">
                                        <FiRefreshCw size={12} />
                                    </button>
                                </div>
                            </div>

                            <div className="notifications-list">
                                {loadingNotifications ? (
                                    <div className="notification-loading">Loading...</div>
                                ) : notifications.length === 0 ? (
                                    <div className="no-notifications">No new notifications</div>
                                ) : (
                                    notifications.map(notification => (
                                        <div
                                            key={notification._id}
                                            className="notification-item unread"
                                            onClick={() => markAsRead(notification._id)}
                                        >
                                            <div className="notification-content">
                                                <h4>{notification.title}</h4>
                                                <p>{notification.message}</p>
                                                <span className="notification-time">
                                                    {formatTime(notification.createdAt)}
                                                </span>
                                            </div>
                                            <div className="unread-indicator"></div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="notifications-footer">
                                <button className="view-all-btn">View All Notifications</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="user-menu-container">
                    <button
                        className="user-menu-trigger"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        aria-label="User menu"
                    >
                        <div className="user-avatar">
                            <FiUser />
                        </div>
                        <div className="user-info">
                            <span className="user-name">{user?.name || 'Admin User'}</span>
                            <span className="user-role">{user?.role || 'Administrator'}</span>
                        </div>
                    </button>

                    {showUserMenu && (
                        <div className="user-menu-dropdown">
                            <div className="user-menu-header">
                                <div className="user-avatar-large">
                                    <FiUser />
                                </div>
                                <div className="user-details">
                                    <h4>{user?.name || 'Admin User'}</h4>
                                    <p>{user?.email || 'admin@thevanity.com'}</p>
                                </div>
                            </div>

                            <div className="user-menu-items">
                                <button className="user-menu-item">
                                    <FiUser />
                                    <span>Profile Settings</span>
                                </button>
                                <button className="user-menu-item">
                                    <FiSettings />
                                    <span>Admin Settings</span>
                                </button>
                                <hr className="menu-divider" />
                                <button className="user-menu-item logout-item" onClick={onLogout}>
                                    <FiLogOut />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Overlay to close dropdowns when clicking outside */}
            {(showUserMenu || showNotifications) && (
                <div
                    className="header-overlay"
                    onClick={() => {
                        setShowUserMenu(false);
                        setShowNotifications(false);
                    }}
                />
            )}
        </header>
    );
};

export default AdminHeader;