import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    FiHome,
    FiPackage,
    FiUsers,
    FiShoppingCart,
    FiBarChart2,
    FiGrid,
    FiArchive,
    FiLayers,
    FiSettings,
    FiBell,
    FiLogOut
} from 'react-icons/fi';
import logo from '../../assets/logo.jpg';
import './AdminSidebar.css';

const AdminSidebar = ({ collapsed, currentSection, badges }) => {
    const location = useLocation();

    const navigationItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: FiHome,
            path: '/admin/dashboard',
            badge: null
        },
        {
            section: 'Store Management'
        },
        {
            id: 'products',
            label: 'Products',
            icon: FiPackage,
            path: '/admin/products',
            badge: null
        },
        {
            id: 'categories',
            label: 'Categories',
            icon: FiGrid,
            path: '/admin/categories',
            badge: null
        },
        {
            id: 'inventory',
            label: 'Inventory',
            icon: FiArchive,
            path: '/admin/inventory',
            badge: badges?.inventory > 0 ? badges.inventory : null,
            badgeType: 'warning'
        },
        {
            id: 'orders',
            label: 'Orders',
            icon: FiShoppingCart,
            path: '/admin/orders',
            badge: badges?.orders > 0 ? badges.orders : null,
            badgeType: 'important'
        },
        {
            section: 'Customer'
        },
        {
            id: 'users',
            label: 'Users',
            icon: FiUsers,
            path: '/admin/users',
            badge: null
        },
        {
            id: 'notifications',
            label: 'Notifications',
            icon: FiBell,
            path: '/admin/notifications',
            badge: badges?.notifications > 0 ? badges.notifications : null,
            badgeType: 'info'
        },
        {
            section: 'Analysis & Config'
        },
        {
            id: 'analytics',
            label: 'Analytics',
            icon: FiBarChart2,
            path: '/admin/analytics',
            badge: null
        },
        {
            id: 'content',
            label: 'Content',
            icon: FiLayers,
            path: '/admin/content',
            badge: null
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: FiSettings,
            path: '/admin/settings',
            badge: null
        }
    ];

    return (
        <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-brand">
                    <img src={logo} alt="The Vanity" className="sidebar-logo-img" style={{ maxHeight: '40px', borderRadius: '50%' }} />
                    {!collapsed && <span className="brand-text">The Vanity</span>}
                </div>
            </div>

            <nav className="sidebar-nav">
                <ul className="nav-list">
                    {navigationItems.map((item, index) => {
                        // Render Section Headers
                        if (item.section) {
                            return !collapsed ? (
                                <li key={`section-${index}`} className="nav-section-header">
                                    {item.section}
                                </li>
                            ) : (
                                <li key={`section-${index}`} className="nav-divider"></li>
                            );
                        }

                        const Icon = item.icon;
                        const isActive = location.pathname.startsWith(item.path) ||
                            (item.id === currentSection);

                        return (
                            <li key={item.id} className="nav-item">
                                <Link
                                    to={item.path}
                                    className={`nav-link ${isActive ? 'active' : ''}`}
                                    title={collapsed ? item.label : ''}
                                >
                                    <div className="nav-icon-wrapper">
                                        <Icon className="nav-icon" />
                                        {collapsed && item.badge && (
                                            <span className={`nav-dot ${item.badgeType || 'default'}`}></span>
                                        )}
                                    </div>

                                    {!collapsed && (
                                        <div className="nav-content">
                                            <span className="nav-label">{item.label}</span>
                                            {item.badge && (
                                                <span className={`nav-badge ${item.badgeType || 'default'}`}>
                                                    {item.badge > 99 ? '99+' : item.badge}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {isActive && !collapsed && <div className="active-indicator"></div>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="sidebar-footer">
                {!collapsed && (
                    <div className="footer-info">
                        <span className="version">v1.0.0</span>
                        <span className="copyright">© 2024 The Vanity</span>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default AdminSidebar;