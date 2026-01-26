import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API_BASE_URL from '../config';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
};

export const AdminAuthProvider = ({ children }) => {
    // ... (state setup remains the same)

    // ... (other effects remain same)

    const adminLogin = async (credentials) => {
        try {
            const { username, password, email } = credentials;

            // Allow login with either email or username (our backend uses 'email' field)
            // If user enters 'admin', we can try mapping it or let backend handle logical "email" field.
            // Backend expects 'email' and 'password'.

            const loginEmail = email || (username.includes('@') ? username : 'admin@thevanity.com'); // Fallback for simple 'admin' username in dev

            const response = await fetch(`${API_BASE_URL}/api/auth/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: loginEmail,
                    password: password
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                const { token, user } = result;
                const adminUser = { ...user };

                // Assuming backend token expires in 7 days or similar, match frontend valid time
                const expiry = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours session logic on frontend

                setAdminUser(adminUser);
                setIsAdminAuthenticated(true);
                setSessionExpiry(expiry);
                setLastActivity(new Date());

                localStorage.setItem('adminUser', JSON.stringify(adminUser));
                localStorage.setItem('adminToken', token);
                localStorage.setItem('adminSessionExpiry', expiry.toISOString());

                // Set up auto-logout timer
                setTimeout(() => {
                    adminLogout();
                }, 8 * 60 * 60 * 1000);

                return { success: true, user: adminUser };
            } else {
                return { success: false, message: result.message || 'Invalid admin credentials' };
            }
        } catch (error) {
            console.error("Error during admin login:", error);
            return { success: false, message: "Network error occurred or server unavailable" };
        }
    };

    const adminLogout = useCallback(() => {
        setAdminUser(null);
        setIsAdminAuthenticated(false);
        setSessionExpiry(null);
        setLastActivity(new Date());

        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminSessionExpiry');
    }, []);

    const refreshSession = useCallback(() => {
        if (isAdminAuthenticated && adminUser && validateSession()) {
            // In a real app, call a refresh token endpoint. 
            // Here we just extend the frontend timer if the token is still valid.
            const newExpiry = new Date(Date.now() + 8 * 60 * 60 * 1000);

            setSessionExpiry(newExpiry);
            localStorage.setItem('adminSessionExpiry', newExpiry.toISOString());

            // Reset auto-logout timer
            setTimeout(() => {
                adminLogout();
            }, 8 * 60 * 60 * 1000);
        }
    }, [isAdminAuthenticated, adminUser, validateSession, adminLogout]);

    const hasPermission = useCallback((permission) => {
        if (!adminUser) return false;
        // Super admin has all permissions
        if (adminUser.role === 'admin') return true;
        // Implement granular permissions check if backend sends them
        // For now, simple role based:
        return true;
    }, [adminUser]);

    const getActivityLogs = useCallback(() => {
        return JSON.parse(localStorage.getItem('adminActivityLogs') || '[]');
    }, []);

    const value = {
        adminUser,
        isAdminAuthenticated,
        loading,
        sessionExpiry,
        lastActivity,
        adminLogin,
        adminLogout,
        refreshSession,
        hasPermission,
        getActivityLogs,
        updateActivity
    };

    return (
        <AdminAuthContext.Provider value={value}>
            {children}
        </AdminAuthContext.Provider>
    );
};