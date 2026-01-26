import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FiBell,
    FiAlertCircle,
    FiCheckCircle,
    FiX,
    FiSettings,
    FiTrash2,
    FiEye,
    FiRefreshCw,
    FiSearch,
    FiClock,
    FiUser,
    FiPackage,
    FiShoppingCart
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useAdminAuth } from '../../context/AdminAuthContext';
import API_BASE_URL from '../../config';
import './NotificationSystem.css';

const NotificationSystem = () => {
    const { hasPermission } = useAdminAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [filters, setFilters] = useState({
        type: '',
        status: '',
        priority: ''
    });

    // Notification preferences
    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        pushNotifications: true,
        orderNotifications: true,
        inventoryAlerts: true,
        userActivityAlerts: false,
        systemAlerts: true,
        marketingNotifications: false,
        soundEnabled: true,
        quietHours: {
            enabled: false,
            start: '22:00',
            end: '08:00'
        }
    });



    const notificationTypes = {
        all: { label: 'All', icon: FiBell },
        order: { label: 'Orders', icon: FiShoppingCart },
        inventory: { label: 'Inventory', icon: FiPackage },
        user: { label: 'Users', icon: FiUser },
        system: { label: 'System', icon: FiSettings }
    };

    const priorityConfig = {
        high: { label: 'High', color: '#ef4444' },
        medium: { label: 'Medium', color: '#f59e0b' },
        low: { label: 'Low', color: '#6b7280' }
    };

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE_URL}/api/admin/notifications`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }
            const data = await response.json();
            const notificationsData = data.data || [];

            // Map icon names to actual icon components
            const iconMap = {
                'FiShoppingCart': FiShoppingCart,
                'FiPackage': FiPackage,
                'FiUser': FiUser,
                'FiCheckCircle': FiCheckCircle,
                'FiAlertCircle': FiAlertCircle
            };

            const notificationsWithIcons = notificationsData.map(notif => ({
                ...notif,
                icon: iconMap[notif.iconName] || FiBell
            }));

            setNotifications(notificationsWithIcons);
            setLoading(false);
        } catch (error) {
            console.error('Error loading notifications:', error);
            toast.error('Failed to load notifications');
            setLoading(false);
        }
    };

    const loadPreferences = async () => {
        try {
            // In a real app, this would load user preferences from API
            // const response = await fetch('/api/admin/notification-preferences');
            // const data = await response.json();
            // setPreferences(data);
        } catch (error) {
            console.error('Error loading preferences:', error);
        }
    };

    useEffect(() => {
        loadNotifications();
        loadPreferences();
    }, []);

    const markAsRead = async (notificationId) => {
        try {
            setNotifications(prev =>
                prev.map(notification =>
                    notification.id === notificationId
                        ? { ...notification, read: true }
                        : notification
                )
            );
            // In a real app, this would be an API call
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            setNotifications(prev =>
                prev.map(notification => ({ ...notification, read: true }))
            );
            toast.success('All notifications marked as read');
        } catch (error) {
            console.error('Error marking all as read:', error);
            toast.error('Failed to mark notifications as read');
        }
    };

    const deleteNotification = async (notificationId) => {
        if (!hasPermission('notifications.write')) {
            toast.error('You do not have permission to delete notifications');
            return;
        }

        try {
            setNotifications(prev =>
                prev.filter(notification => notification.id !== notificationId)
            );
            toast.success('Notification deleted');
        } catch (error) {
            console.error('Error deleting notification:', error);
            toast.error('Failed to delete notification');
        }
    };

    const clearAllNotifications = async () => {
        if (!hasPermission('notifications.write')) {
            toast.error('You do not have permission to clear notifications');
            return;
        }

        if (!window.confirm('Are you sure you want to clear all notifications?')) {
            return;
        }

        try {
            setNotifications([]);
            toast.success('All notifications cleared');
        } catch (error) {
            console.error('Error clearing notifications:', error);
            toast.error('Failed to clear notifications');
        }
    };

    const savePreferences = async () => {
        try {
            // In a real app, this would be an API call
            // await fetch('/api/admin/notification-preferences', {
            //     method: 'PUT',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(preferences)
            // });

            toast.success('Notification preferences saved');
            setShowSettings(false);
        } catch (error) {
            console.error('Error saving preferences:', error);
            toast.error('Failed to save preferences');
        }
    };

    const getFilteredNotifications = () => {
        let filtered = notifications;

        // Filter by tab
        if (activeTab !== 'all') {
            filtered = filtered.filter(notification => notification.type === activeTab);
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(notification =>
                notification.title.toLowerCase().includes(query) ||
                notification.message.toLowerCase().includes(query)
            );
        }

        // Filter by type
        if (filters.type) {
            filtered = filtered.filter(notification => notification.type === filters.type);
        }

        // Filter by status
        if (filters.status === 'read') {
            filtered = filtered.filter(notification => notification.read);
        } else if (filters.status === 'unread') {
            filtered = filtered.filter(notification => !notification.read);
        }

        // Filter by priority
        if (filters.priority) {
            filtered = filtered.filter(notification => notification.priority === filters.priority);
        }

        return filtered;
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            const diffInMinutes = Math.floor((now - date) / (1000 * 60));
            return `${diffInMinutes}m ago`;
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)}h ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    if (loading) {
        return (
            <div className="notification-system">
                <div className="notification-header">
                    <h2>Notifications</h2>
                </div>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading notifications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="notification-system">
            <div className="notification-header">
                <div className="header-left">
                    <h2>Notifications</h2>
                    {unreadCount > 0 && (
                        <span className="unread-badge">{unreadCount} unread</span>
                    )}
                </div>
                <div className="header-actions">
                    <button
                        className="btn-icon"
                        onClick={loadNotifications}
                        title="Refresh notifications"
                    >
                        <FiRefreshCw />
                    </button>
                    <button
                        className="btn-icon"
                        onClick={() => setShowSettings(!showSettings)}
                        title="Notification settings"
                    >
                        <FiSettings />
                    </button>
                    {unreadCount > 0 && (
                        <button
                            className="btn-secondary"
                            onClick={markAllAsRead}
                        >
                            Mark all as read
                        </button>
                    )}
                    {hasPermission('notifications.write') && (
                        <button
                            className="btn-danger"
                            onClick={clearAllNotifications}
                        >
                            Clear all
                        </button>
                    )}
                </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
                <div className="notification-settings">
                    <div className="settings-header">
                        <h3>Notification Preferences</h3>
                        <button
                            className="btn-icon"
                            onClick={() => setShowSettings(false)}
                        >
                            <FiX />
                        </button>
                    </div>
                    <div className="settings-content">
                        <div className="settings-section">
                            <h4>General Settings</h4>
                            <div className="setting-item">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={preferences.emailNotifications}
                                        onChange={(e) => setPreferences(prev => ({
                                            ...prev,
                                            emailNotifications: e.target.checked
                                        }))}
                                    />
                                    Email notifications
                                </label>
                            </div>
                            <div className="setting-item">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={preferences.pushNotifications}
                                        onChange={(e) => setPreferences(prev => ({
                                            ...prev,
                                            pushNotifications: e.target.checked
                                        }))}
                                    />
                                    Push notifications
                                </label>
                            </div>
                            <div className="setting-item">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={preferences.soundEnabled}
                                        onChange={(e) => setPreferences(prev => ({
                                            ...prev,
                                            soundEnabled: e.target.checked
                                        }))}
                                    />
                                    Sound notifications
                                </label>
                            </div>
                        </div>

                        <div className="settings-section">
                            <h4>Notification Types</h4>
                            <div className="setting-item">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={preferences.orderNotifications}
                                        onChange={(e) => setPreferences(prev => ({
                                            ...prev,
                                            orderNotifications: e.target.checked
                                        }))}
                                    />
                                    Order notifications
                                </label>
                            </div>
                            <div className="setting-item">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={preferences.inventoryAlerts}
                                        onChange={(e) => setPreferences(prev => ({
                                            ...prev,
                                            inventoryAlerts: e.target.checked
                                        }))}
                                    />
                                    Inventory alerts
                                </label>
                            </div>
                            <div className="setting-item">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={preferences.userActivityAlerts}
                                        onChange={(e) => setPreferences(prev => ({
                                            ...prev,
                                            userActivityAlerts: e.target.checked
                                        }))}
                                    />
                                    User activity alerts
                                </label>
                            </div>
                            <div className="setting-item">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={preferences.systemAlerts}
                                        onChange={(e) => setPreferences(prev => ({
                                            ...prev,
                                            systemAlerts: e.target.checked
                                        }))}
                                    />
                                    System alerts
                                </label>
                            </div>
                        </div>

                        <div className="settings-section">
                            <h4>Quiet Hours</h4>
                            <div className="setting-item">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={preferences.quietHours.enabled}
                                        onChange={(e) => setPreferences(prev => ({
                                            ...prev,
                                            quietHours: {
                                                ...prev.quietHours,
                                                enabled: e.target.checked
                                            }
                                        }))}
                                    />
                                    Enable quiet hours
                                </label>
                            </div>
                            {preferences.quietHours.enabled && (
                                <div className="quiet-hours-config">
                                    <div className="time-input-group">
                                        <label>From:</label>
                                        <input
                                            type="time"
                                            value={preferences.quietHours.start}
                                            onChange={(e) => setPreferences(prev => ({
                                                ...prev,
                                                quietHours: {
                                                    ...prev.quietHours,
                                                    start: e.target.value
                                                }
                                            }))}
                                        />
                                    </div>
                                    <div className="time-input-group">
                                        <label>To:</label>
                                        <input
                                            type="time"
                                            value={preferences.quietHours.end}
                                            onChange={(e) => setPreferences(prev => ({
                                                ...prev,
                                                quietHours: {
                                                    ...prev.quietHours,
                                                    end: e.target.value
                                                }
                                            }))}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="settings-actions">
                            <button className="btn-primary" onClick={savePreferences}>
                                Save Preferences
                            </button>
                            <button
                                className="btn-secondary"
                                onClick={() => setShowSettings(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Search and Filters */}
            <div className="notification-controls">
                <div className="search-container">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search notifications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="filter-container">
                    <select
                        value={filters.type}
                        onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                        className="filter-select"
                    >
                        <option value="">All Types</option>
                        <option value="order">Orders</option>
                        <option value="inventory">Inventory</option>
                        <option value="user">Users</option>
                        <option value="system">System</option>
                    </select>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        className="filter-select"
                    >
                        <option value="">All Status</option>
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                    </select>
                    <select
                        value={filters.priority}
                        onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                        className="filter-select"
                    >
                        <option value="">All Priority</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
            </div>

            {/* Notification Tabs */}
            <div className="notification-tabs">
                {Object.entries(notificationTypes).map(([key, config]) => {
                    const Icon = config.icon;
                    const count = key === 'all'
                        ? notifications.length
                        : notifications.filter(n => n.type === key).length;

                    return (
                        <button
                            key={key}
                            className={`tab-button ${activeTab === key ? 'active' : ''}`}
                            onClick={() => setActiveTab(key)}
                        >
                            <Icon />
                            <span>{config.label}</span>
                            {count > 0 && <span className="tab-count">{count}</span>}
                        </button>
                    );
                })}
            </div>

            {/* Notifications List */}
            <div className="notifications-list">
                {getFilteredNotifications().length === 0 ? (
                    <div className="empty-state">
                        <FiBell className="empty-icon" />
                        <h3>No notifications found</h3>
                        <p>
                            {searchQuery || Object.values(filters).some(f => f)
                                ? 'Try adjusting your search or filters'
                                : 'You\'re all caught up!'
                            }
                        </p>
                    </div>
                ) : (
                    getFilteredNotifications().map(notification => {
                        const Icon = notification.icon;
                        return (
                            <div
                                key={notification.id}
                                className={`notification-item ${!notification.read ? 'unread' : ''}`}
                                onClick={() => !notification.read && markAsRead(notification.id)}
                            >
                                <div className="notification-icon" style={{ color: notification.color }}>
                                    <Icon />
                                </div>
                                <div className="notification-content">
                                    <div className="notification-header-item">
                                        <h4 className="notification-title">{notification.title}</h4>
                                        <div className="notification-meta">
                                            <span
                                                className={`priority-badge priority-${notification.priority}`}
                                                style={{ backgroundColor: priorityConfig[notification.priority].color }}
                                            >
                                                {priorityConfig[notification.priority].label}
                                            </span>
                                            <span className="notification-time">
                                                <FiClock />
                                                {formatTimestamp(notification.timestamp)}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="notification-message">{notification.message}</p>
                                    {notification.actionUrl && (
                                        <div className="notification-actions">
                                            <Link
                                                to={notification.actionUrl}
                                                className="action-link"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    )}
                                </div>
                                <div className="notification-controls-item">
                                    {!notification.read && (
                                        <button
                                            className="btn-icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                markAsRead(notification.id);
                                            }}
                                            title="Mark as read"
                                        >
                                            <FiEye />
                                        </button>
                                    )}
                                    {hasPermission('notifications.write') && (
                                        <button
                                            className="btn-icon btn-danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNotification(notification.id);
                                            }}
                                            title="Delete notification"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default NotificationSystem;