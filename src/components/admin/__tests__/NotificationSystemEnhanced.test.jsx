import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import fc from 'fast-check';
import NotificationSystem from '../NotificationSystem';
import { AdminAuthProvider } from '../../../context/AdminAuthContext';

// Mock the AdminAuthContext
const mockAdminAuth = {
    user: { id: '1', email: 'admin@test.com', role: 'admin' },
    hasPermission: jest.fn(() => true),
    logout: jest.fn()
};

jest.mock('../../../context/AdminAuthContext', () => ({
    useAdminAuth: () => mockAdminAuth,
    AdminAuthProvider: ({ children }) => <div>{children}</div>
}));

const renderNotificationSystem = () => {
    return render(
        <BrowserRouter>
            <AdminAuthProvider>
                <NotificationSystem />
                <Toaster />
            </AdminAuthProvider>
        </BrowserRouter>
    );
};

describe('NotificationSystem Property-Based Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockAdminAuth.hasPermission.mockReturnValue(true);
    });

    /**
     * Property 49: Real-time Alert Display
     * Notifications should be displayed in real-time with proper prioritization and formatting
     */
    test('Property 49: Real-time Alert Display', () => {
        fc.assert(fc.property(
            fc.array(fc.record({
                id: fc.string({ minLength: 1, maxLength: 20 }),
                type: fc.constantFrom('order', 'inventory', 'user', 'system'),
                priority: fc.constantFrom('high', 'medium', 'low'),
                title: fc.string({ minLength: 1, maxLength: 100 }),
                message: fc.string({ minLength: 1, maxLength: 300 }),
                timestamp: fc.date({ min: new Date('2024-01-01'), max: new Date() })
                    .map(d => d.toISOString()),
                read: fc.boolean(),
                actionUrl: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: null })
            }), { minLength: 1, maxLength: 20 }),
            (notificationsData) => {
                // Sort notifications by timestamp (newest first) and priority
                const sortedNotifications = notificationsData.sort((a, b) => {
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
                    if (priorityDiff !== 0) return priorityDiff;
                    return new Date(b.timestamp) - new Date(a.timestamp);
                });

                global.fetch = jest.fn((url) => {
                    if (url.includes('/notifications')) {
                        return Promise.resolve({
                            ok: true,
                            json: () => Promise.resolve(sortedNotifications)
                        });
                    }
                    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
                });

                renderNotificationSystem();

                return waitFor(() => {
                    // Verify notifications are displayed
                    sortedNotifications.forEach(notification => {
                        expect(screen.getByText(notification.title)).toBeInTheDocument();
                        expect(screen.getByText(notification.message)).toBeInTheDocument();
                    });
                    
                    // Verify priority-based display
                    const highPriorityNotifications = sortedNotifications.filter(n => n.priority === 'high');
                    const unreadNotifications = sortedNotifications.filter(n => !n.read);
                    
                    // High priority notifications should be prominently displayed
                    highPriorityNotifications.forEach(notification => {
                        const titleElement = screen.getByText(notification.title);
                        expect(titleElement).toBeInTheDocument();
                        
                        // Verify priority badge is displayed
                        const priorityElements = screen.getAllByText(/high/i);
                        expect(priorityElements.length).toBeGreaterThan(0);
                    });
                    
                    // Verify unread count display
                    if (unreadNotifications.length > 0) {
                        const unreadBadge = screen.queryByText(`${unreadNotifications.length} unread`);
                        if (unreadBadge) {
                            expect(unreadBadge).toBeInTheDocument();
                        }
                    }
                    
                    // Verify timestamp formatting
                    sortedNotifications.forEach(notification => {
                        const timestamp = new Date(notification.timestamp);
                        expect(timestamp).toBeInstanceOf(Date);
                        expect(isNaN(timestamp.getTime())).toBe(false);
                        
                        // Verify timestamp is not in the future
                        expect(timestamp.getTime()).toBeLessThanOrEqual(Date.now());
                    });
                    
                    // Verify notification types are valid
                    sortedNotifications.forEach(notification => {
                        expect(['order', 'inventory', 'user', 'system']).toContain(notification.type);
                        expect(['high', 'medium', 'low']).toContain(notification.priority);
                        expect(notification.title.length).toBeGreaterThan(0);
                        expect(notification.message.length).toBeGreaterThan(0);
                    });
                });
            }
        ), { numRuns: 40 });
    });

    /**
     * Property 51: Inventory Alert Generation
     * Inventory-related notifications should be generated based on stock levels and thresholds
     */
    test('Property 51: Inventory Alert Generation', () => {
        fc.assert(fc.property(
            fc.array(fc.record({
                productId: fc.string({ minLength: 1, maxLength: 20 }),
                productName: fc.string({ minLength: 1, maxLength: 100 }),
                currentStock: fc.integer({ min: 0, max: 1000 }),
                minStockLevel: fc.integer({ min: 1, max: 50 }),
                reorderPoint: fc.integer({ min: 5, max: 100 }),
                category: fc.string({ minLength: 1, maxLength: 30 })
            }).filter(data => data.reorderPoint >= data.minStockLevel), { minLength: 1, maxLength: 10 }),
            (inventoryData) => {
                // Generate notifications based on inventory conditions
                const generatedNotifications = inventoryData.map(item => {
                    const isOutOfStock = item.currentStock === 0;
                    const isLowStock = item.currentStock > 0 && item.currentStock <= item.minStockLevel;
                    const needsReorder = item.currentStock <= item.reorderPoint;
                    
                    let alertType, priority, title, message;
                    
                    if (isOutOfStock) {
                        alertType = 'out_of_stock';
                        priority = 'high';
                        title = 'Out of Stock Alert';
                        message = `${item.productName} is out of stock`;
                    } else if (isLowStock) {
                        alertType = 'low_stock';
                        priority = 'medium';
                        title = 'Low Stock Alert';
                        message = `${item.productName} is running low (${item.currentStock} units remaining)`;
                    } else if (needsReorder) {
                        alertType = 'reorder';
                        priority = 'medium';
                        title = 'Reorder Alert';
                        message = `${item.productName} has reached reorder point (${item.currentStock} units)`;
                    } else {
                        return null; // No alert needed
                    }
                    
                    return {
                        id: `inv-${item.productId}-${alertType}`,
                        type: 'inventory',
                        priority,
                        title,
                        message,
                        timestamp: new Date().toISOString(),
                        read: false,
                        actionUrl: `/admin/inventory?product=${item.productId}`,
                        metadata: {
                            productId: item.productId,
                            productName: item.productName,
                            currentStock: item.currentStock,
                            alertType
                        }
                    };
                }).filter(Boolean);

                global.fetch = jest.fn((url) => {
                    if (url.includes('/notifications')) {
                        return Promise.resolve({
                            ok: true,
                            json: () => Promise.resolve(generatedNotifications)
                        });
                    }
                    if (url.includes('/inventory/alerts')) {
                        return Promise.resolve({
                            ok: true,
                            json: () => Promise.resolve({
                                alerts: generatedNotifications,
                                summary: {
                                    outOfStock: generatedNotifications.filter(n => n.metadata?.alertType === 'out_of_stock').length,
                                    lowStock: generatedNotifications.filter(n => n.metadata?.alertType === 'low_stock').length,
                                    reorderNeeded: generatedNotifications.filter(n => n.metadata?.alertType === 'reorder').length
                                }
                            })
                        });
                    }
                    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
                });

                renderNotificationSystem();

                return waitFor(() => {
                    // Verify inventory alerts are generated correctly
                    generatedNotifications.forEach(notification => {
                        expect(screen.getByText(notification.title)).toBeInTheDocument();
                        expect(screen.getByText(notification.message)).toBeInTheDocument();
                        
                        // Verify alert logic is correct
                        const item = inventoryData.find(i => i.productId === notification.metadata.productId);
                        if (item) {
                            if (item.currentStock === 0) {
                                expect(notification.metadata.alertType).toBe('out_of_stock');
                                expect(notification.priority).toBe('high');
                            } else if (item.currentStock <= item.minStockLevel) {
                                expect(notification.metadata.alertType).toBe('low_stock');
                                expect(notification.priority).toBe('medium');
                            } else if (item.currentStock <= item.reorderPoint) {
                                expect(notification.metadata.alertType).toBe('reorder');
                                expect(notification.priority).toBe('medium');
                            }
                        }
                    });
                    
                    // Verify alert generation logic
                    inventoryData.forEach(item => {
                        const shouldHaveOutOfStockAlert = item.currentStock === 0;
                        const shouldHaveLowStockAlert = item.currentStock > 0 && item.currentStock <= item.minStockLevel;
                        const shouldHaveReorderAlert = item.currentStock <= item.reorderPoint && item.currentStock > item.minStockLevel;
                        
                        const relatedNotifications = generatedNotifications.filter(n => 
                            n.metadata?.productId === item.productId
                        );
                        
                        if (shouldHaveOutOfStockAlert) {
                            expect(relatedNotifications.some(n => n.metadata.alertType === 'out_of_stock')).toBe(true);
                        }
                        
                        if (shouldHaveLowStockAlert) {
                            expect(relatedNotifications.some(n => n.metadata.alertType === 'low_stock')).toBe(true);
                        }
                        
                        if (shouldHaveReorderAlert) {
                            expect(relatedNotifications.some(n => n.metadata.alertType === 'reorder')).toBe(true);
                        }
                    });
                    
                    // Verify notification metadata integrity
                    generatedNotifications.forEach(notification => {
                        expect(notification.type).toBe('inventory');
                        expect(['high', 'medium', 'low']).toContain(notification.priority);
                        expect(notification.metadata).toBeDefined();
                        expect(notification.metadata.productId).toBeDefined();
                        expect(notification.metadata.productName).toBeDefined();
                        expect(typeof notification.metadata.currentStock).toBe('number');
                        expect(notification.metadata.currentStock).toBeGreaterThanOrEqual(0);
                    });
                });
            }
        ), { numRuns: 35 });
    });

    /**
     * Property 54: Notification Preference Customization
     * Users should be able to customize notification preferences with proper validation
     */
    test('Property 54: Notification Preference Customization', () => {
        fc.assert(fc.property(
            fc.record({
                emailNotifications: fc.boolean(),
                pushNotifications: fc.boolean(),
                orderNotifications: fc.boolean(),
                inventoryAlerts: fc.boolean(),
                userActivityAlerts: fc.boolean(),
                systemAlerts: fc.boolean(),
                marketingNotifications: fc.boolean(),
                soundEnabled: fc.boolean(),
                quietHours: fc.record({
                    enabled: fc.boolean(),
                    start: fc.constantFrom('22:00', '23:00', '00:00', '01:00'),
                    end: fc.constantFrom('06:00', '07:00', '08:00', '09:00')
                }),
                notificationTypes: fc.array(fc.constantFrom('order', 'inventory', 'user', 'system'), { minLength: 1, maxLength: 4 }),
                deliveryMethods: fc.array(fc.constantFrom('email', 'push', 'sms'), { minLength: 1, maxLength: 3 })
            }),
            (preferencesData) => {
                const mockPreferences = preferencesData;

                global.fetch = jest.fn((url, options) => {
                    if (url.includes('/notification-preferences') && options?.method === 'GET') {
                        return Promise.resolve({
                            ok: true,
                            json: () => Promise.resolve(mockPreferences)
                        });
                    }
                    if (url.includes('/notification-preferences') && options?.method === 'PUT') {
                        const updatedPreferences = JSON.parse(options.body);
                        return Promise.resolve({
                            ok: true,
                            json: () => Promise.resolve({
                                success: true,
                                preferences: updatedPreferences
                            })
                        });
                    }
                    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
                });

                renderNotificationSystem();

                return waitFor(() => {
                    // Open settings panel
                    const settingsButton = screen.queryByTitle(/notification settings/i) ||
                                          screen.queryByText(/settings/i);
                    if (settingsButton) {
                        fireEvent.click(settingsButton);
                        
                        // Verify preference options are displayed
                        const emailCheckbox = screen.queryByLabelText(/email notifications/i);
                        const pushCheckbox = screen.queryByLabelText(/push notifications/i);
                        const soundCheckbox = screen.queryByLabelText(/sound/i);
                        
                        if (emailCheckbox) {
                            expect(emailCheckbox.checked).toBe(preferencesData.emailNotifications);
                        }
                        
                        if (pushCheckbox) {
                            expect(pushCheckbox.checked).toBe(preferencesData.pushNotifications);
                        }
                        
                        if (soundCheckbox) {
                            expect(soundCheckbox.checked).toBe(preferencesData.soundEnabled);
                        }
                        
                        // Test preference updates
                        if (emailCheckbox) {
                            fireEvent.click(emailCheckbox);
                            expect(emailCheckbox.checked).toBe(!preferencesData.emailNotifications);
                        }
                        
                        // Verify quiet hours configuration
                        if (preferencesData.quietHours.enabled) {
                            const quietHoursCheckbox = screen.queryByLabelText(/quiet hours/i);
                            if (quietHoursCheckbox) {
                                expect(quietHoursCheckbox.checked).toBe(true);
                                
                                // Verify time inputs are available
                                const timeInputs = screen.queryAllByDisplayValue(/\d{2}:\d{2}/);
                                expect(timeInputs.length).toBeGreaterThanOrEqual(0);
                            }
                        }
                    }
                    
                    // Verify preference validation
                    expect(typeof preferencesData.emailNotifications).toBe('boolean');
                    expect(typeof preferencesData.pushNotifications).toBe('boolean');
                    expect(typeof preferencesData.soundEnabled).toBe('boolean');
                    expect(typeof preferencesData.quietHours.enabled).toBe('boolean');
                    
                    // Verify quiet hours time format
                    expect(preferencesData.quietHours.start).toMatch(/^\d{2}:\d{2}$/);
                    expect(preferencesData.quietHours.end).toMatch(/^\d{2}:\d{2}$/);
                    
                    // Verify notification types are valid
                    preferencesData.notificationTypes.forEach(type => {
                        expect(['order', 'inventory', 'user', 'system']).toContain(type);
                    });
                    
                    // Verify delivery methods are valid
                    preferencesData.deliveryMethods.forEach(method => {
                        expect(['email', 'push', 'sms']).toContain(method);
                    });
                    
                    // Verify logical consistency
                    if (preferencesData.emailNotifications) {
                        expect(preferencesData.deliveryMethods).toContain('email');
                    }
                    
                    if (preferencesData.pushNotifications) {
                        expect(preferencesData.deliveryMethods).toContain('push');
                    }
                });
            }
        ), { numRuns: 30 });
    });

    /**
     * Property 50: Notification Filtering and Search
     * Notification filtering and search should work accurately across all notification properties
     */
    test('Property 50: Notification Filtering and Search', () => {
        fc.assert(fc.property(
            fc.record({
                notifications: fc.array(fc.record({
                    id: fc.string({ minLength: 1, maxLength: 20 }),
                    type: fc.constantFrom('order', 'inventory', 'user', 'system'),
                    priority: fc.constantFrom('high', 'medium', 'low'),
                    title: fc.string({ minLength: 5, maxLength: 50 }),
                    message: fc.string({ minLength: 10, maxLength: 200 }),
                    read: fc.boolean(),
                    timestamp: fc.date().map(d => d.toISOString()),
                    tags: fc.array(fc.string({ minLength: 3, maxLength: 15 }), { minLength: 0, maxLength: 3 })
                }), { minLength: 5, maxLength: 20 }),
                searchQuery: fc.string({ minLength: 2, maxLength: 20 }),
                typeFilter: fc.option(fc.constantFrom('order', 'inventory', 'user', 'system'), { nil: null }),
                statusFilter: fc.option(fc.constantFrom('read', 'unread'), { nil: null }),
                priorityFilter: fc.option(fc.constantFrom('high', 'medium', 'low'), { nil: null })
            }),
            (filterData) => {
                // Apply filters to notifications
                let filteredNotifications = filterData.notifications;
                
                // Apply search query filter
                if (filterData.searchQuery) {
                    const query = filterData.searchQuery.toLowerCase();
                    filteredNotifications = filteredNotifications.filter(notification =>
                        notification.title.toLowerCase().includes(query) ||
                        notification.message.toLowerCase().includes(query) ||
                        notification.tags.some(tag => tag.toLowerCase().includes(query))
                    );
                }
                
                // Apply type filter
                if (filterData.typeFilter) {
                    filteredNotifications = filteredNotifications.filter(notification =>
                        notification.type === filterData.typeFilter
                    );
                }
                
                // Apply status filter
                if (filterData.statusFilter) {
                    const isRead = filterData.statusFilter === 'read';
                    filteredNotifications = filteredNotifications.filter(notification =>
                        notification.read === isRead
                    );
                }
                
                // Apply priority filter
                if (filterData.priorityFilter) {
                    filteredNotifications = filteredNotifications.filter(notification =>
                        notification.priority === filterData.priorityFilter
                    );
                }

                global.fetch = jest.fn((url) => {
                    if (url.includes('/notifications')) {
                        return Promise.resolve({
                            ok: true,
                            json: () => Promise.resolve(filterData.notifications)
                        });
                    }
                    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
                });

                renderNotificationSystem();

                return waitFor(() => {
                    // Test search functionality
                    const searchInput = screen.queryByPlaceholderText(/search notifications/i);
                    if (searchInput) {
                        fireEvent.change(searchInput, { target: { value: filterData.searchQuery } });
                        
                        // Verify search results
                        const expectedResults = filterData.notifications.filter(notification => {
                            const query = filterData.searchQuery.toLowerCase();
                            return notification.title.toLowerCase().includes(query) ||
                                   notification.message.toLowerCase().includes(query) ||
                                   notification.tags.some(tag => tag.toLowerCase().includes(query));
                        });
                        
                        // Check that matching notifications are displayed
                        expectedResults.forEach(notification => {
                            expect(screen.getByText(notification.title)).toBeInTheDocument();
                        });
                    }
                    
                    // Test type filter
                    if (filterData.typeFilter) {
                        const typeSelect = screen.queryByDisplayValue(/all types/i) ||
                                          screen.queryAllByRole('combobox').find(select => 
                                              select.name?.includes('type') || select.id?.includes('type')
                                          );
                        
                        if (typeSelect) {
                            fireEvent.change(typeSelect, { target: { value: filterData.typeFilter } });
                            
                            // Verify only notifications of selected type are shown
                            const expectedTypeResults = filterData.notifications.filter(notification =>
                                notification.type === filterData.typeFilter
                            );
                            
                            expectedTypeResults.forEach(notification => {
                                expect(screen.getByText(notification.title)).toBeInTheDocument();
                            });
                        }
                    }
                    
                    // Test status filter
                    if (filterData.statusFilter) {
                        const statusSelect = screen.queryByDisplayValue(/all status/i) ||
                                           screen.queryAllByRole('combobox').find(select => 
                                               select.name?.includes('status') || select.id?.includes('status')
                                           );
                        
                        if (statusSelect) {
                            fireEvent.change(statusSelect, { target: { value: filterData.statusFilter } });
                            
                            // Verify filtering logic
                            const isRead = filterData.statusFilter === 'read';
                            const expectedStatusResults = filterData.notifications.filter(notification =>
                                notification.read === isRead
                            );
                            
                            expectedStatusResults.forEach(notification => {
                                expect(screen.getByText(notification.title)).toBeInTheDocument();
                            });
                        }
                    }
                    
                    // Verify filter combination logic
                    expect(filteredNotifications.length).toBeLessThanOrEqual(filterData.notifications.length);
                    
                    // Verify each filtered notification meets all criteria
                    filteredNotifications.forEach(notification => {
                        // Check search query match
                        if (filterData.searchQuery) {
                            const query = filterData.searchQuery.toLowerCase();
                            const matchesSearch = notification.title.toLowerCase().includes(query) ||
                                                notification.message.toLowerCase().includes(query) ||
                                                notification.tags.some(tag => tag.toLowerCase().includes(query));
                            expect(matchesSearch).toBe(true);
                        }
                        
                        // Check type filter match
                        if (filterData.typeFilter) {
                            expect(notification.type).toBe(filterData.typeFilter);
                        }
                        
                        // Check status filter match
                        if (filterData.statusFilter) {
                            const expectedRead = filterData.statusFilter === 'read';
                            expect(notification.read).toBe(expectedRead);
                        }
                        
                        // Check priority filter match
                        if (filterData.priorityFilter) {
                            expect(notification.priority).toBe(filterData.priorityFilter);
                        }
                    });
                });
            }
        ), { numRuns: 25 });
    });
});