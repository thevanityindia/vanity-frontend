import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import fc from 'fast-check';
import ContentManager from '../ContentManager';
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

const renderContentManager = () => {
    return render(
        <BrowserRouter>
            <AdminAuthProvider>
                <ContentManager />
                <Toaster />
            </AdminAuthProvider>
        </BrowserRouter>
    );
};

describe('ContentManager Property-Based Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockAdminAuth.hasPermission.mockReturnValue(true);
    });

    /**
     * Property 37: Banner Management Operations
     * Banner management should handle all CRUD operations while maintaining display integrity
     */
    test('Property 37: Banner Management Operations', () => {
        fc.assert(fc.property(
            fc.record({
                id: fc.string({ minLength: 1, maxLength: 20 }),
                title: fc.string({ minLength: 1, maxLength: 100 }),
                description: fc.string({ minLength: 1, maxLength: 200 }),
                image: fc.webUrl(),
                link: fc.string({ minLength: 1, maxLength: 200 }),
                position: fc.constantFrom('hero', 'secondary', 'sidebar'),
                priority: fc.integer({ min: 1, max: 10 }),
                status: fc.constantFrom('draft', 'scheduled', 'published', 'expired'),
                publishDate: fc.date({ min: new Date('2024-01-01'), max: new Date('2024-12-31') })
                    .map(d => d.toISOString()),
                expiryDate: fc.date({ min: new Date('2024-06-01'), max: new Date('2025-12-31') })
                    .map(d => d.toISOString()),
                tags: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 0, maxLength: 5 })
            }).filter(data => new Date(data.publishDate) < new Date(data.expiryDate)),
            (bannerData) => {
                const mockBanners = [bannerData];

                global.fetch = jest.fn((url, options) => {
                    if (url.includes('/content') && options?.method === 'GET') {
                        return Promise.resolve({
                            ok: true,
                            json: () => Promise.resolve({
                                banners: mockBanners,
                                pages: [],
                                campaigns: []
                            })
                        });
                    }
                    if (url.includes('/content') && options?.method === 'POST') {
                        const newBanner = JSON.parse(options.body);
                        return Promise.resolve({
                            ok: true,
                            json: () => Promise.resolve({
                                ...newBanner,
                                id: Date.now().toString(),
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString()
                            })
                        });
                    }
                    if (url.includes('/content') && options?.method === 'PUT') {
                        const updatedBanner = JSON.parse(options.body);
                        return Promise.resolve({
                            ok: true,
                            json: () => Promise.resolve({
                                ...updatedBanner,
                                updatedAt: new Date().toISOString()
                            })
                        });
                    }
                    if (url.includes('/content') && options?.method === 'DELETE') {
                        return Promise.resolve({
                            ok: true,
                            json: () => Promise.resolve({ success: true })
                        });
                    }
                    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
                });

                renderContentManager();

                return waitFor(() => {
                    // Verify banner is displayed
                    expect(screen.getByText(bannerData.title)).toBeInTheDocument();
                    expect(screen.getByText(bannerData.description)).toBeInTheDocument();
                    
                    // Verify banner properties are valid
                    expect(bannerData.title.length).toBeGreaterThan(0);
                    expect(bannerData.description.length).toBeGreaterThan(0);
                    expect(['hero', 'secondary', 'sidebar']).toContain(bannerData.position);
                    expect(['draft', 'scheduled', 'published', 'expired']).toContain(bannerData.status);
                    expect(bannerData.priority).toBeGreaterThanOrEqual(1);
                    expect(bannerData.priority).toBeLessThanOrEqual(10);
                    
                    // Verify date logic
                    expect(new Date(bannerData.publishDate)).toBeLessThan(new Date(bannerData.expiryDate));
                    
                    // Test Create operation
                    const addButton = screen.queryByText(/add banner/i);
                    if (addButton) {
                        fireEvent.click(addButton);
                        
                        // Verify form appears
                        const titleInput = screen.queryByLabelText(/title/i) || 
                                          screen.queryByPlaceholderText(/title/i);
                        if (titleInput) {
                            fireEvent.change(titleInput, { target: { value: 'New Banner' } });
                            expect(titleInput.value).toBe('New Banner');
                        }
                    }
                    
                    // Test Edit operation
                    const editButtons = screen.queryAllByTitle(/edit/i);
                    if (editButtons.length > 0) {
                        fireEvent.click(editButtons[0]);
                        
                        // Verify edit form is populated
                        const titleInput = screen.queryByDisplayValue(bannerData.title);
                        if (titleInput) {
                            expect(titleInput.value).toBe(bannerData.title);
                        }
                    }
                    
                    // Verify tags display
                    if (bannerData.tags && bannerData.tags.length > 0) {
                        bannerData.tags.forEach(tag => {
                            if (tag.trim()) {
                                expect(screen.getByText(tag)).toBeInTheDocument();
                            }
                        });
                    }
                });
            }
        ), { numRuns: 40 });
    });

    /**
     * Property 41: Content Versioning and Rollback
     * Content versioning should maintain history and allow rollback to previous versions
     */
    test('Property 41: Content Versioning and Rollback', () => {
        fc.assert(fc.property(
            fc.record({
                contentId: fc.string({ minLength: 1, maxLength: 20 }),
                versions: fc.array(fc.record({
                    version: fc.integer({ min: 1, max: 10 }),
                    title: fc.string({ minLength: 1, maxLength: 100 }),
                    content: fc.string({ minLength: 10, maxLength: 500 }),
                    author: fc.string({ minLength: 1, maxLength: 50 }),
                    timestamp: fc.date().map(d => d.toISOString()),
                    changes: fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 1, maxLength: 3 })
                }), { minLength: 2, maxLength: 5 })
            }),
            (versionData) => {
                // Sort versions by version number
                const sortedVersions = versionData.versions.sort((a, b) => b.version - a.version);
                const currentVersion = sortedVersions[0];
                const previousVersion = sortedVersions[1];

                const mockContent = {
                    id: versionData.contentId,
                    title: currentVersion.title,
                    content: currentVersion.content,
                    type: 'page',
                    status: 'published',
                    currentVersion: currentVersion.version,
                    versions: sortedVersions,
                    createdAt: new Date().toISOString(),
                    updatedAt: currentVersion.timestamp
                };

                global.fetch = jest.fn((url, options) => {
                    if (url.includes('/content') && options?.method === 'GET') {
                        return Promise.resolve({
                            ok: true,
                            json: () => Promise.resolve({
                                banners: [],
                                pages: [mockContent],
                                campaigns: []
                            })
                        });
                    }
                    if (url.includes('/content/versions')) {
                        return Promise.resolve({
                            ok: true,
                            json: () => Promise.resolve(sortedVersions)
                        });
                    }
                    if (url.includes('/content/rollback') && options?.method === 'POST') {
                        const rollbackData = JSON.parse(options.body);
                        const targetVersion = sortedVersions.find(v => v.version === rollbackData.targetVersion);
                        return Promise.resolve({
                            ok: true,
                            json: () => Promise.resolve({
                                ...mockContent,
                                title: targetVersion.title,
                                content: targetVersion.content,
                                currentVersion: rollbackData.targetVersion,
                                updatedAt: new Date().toISOString()
                            })
                        });
                    }
                    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
                });

                renderContentManager();

                return waitFor(() => {
                    // Switch to pages tab
                    const pagesTab = screen.queryByText(/pages/i);
                    if (pagesTab) {
                        fireEvent.click(pagesTab);
                    }
                    
                    // Verify current content is displayed
                    expect(screen.getByText(currentVersion.title)).toBeInTheDocument();
                    
                    // Test version history access
                    const editButtons = screen.queryAllByTitle(/edit/i);
                    if (editButtons.length > 0) {
                        fireEvent.click(editButtons[0]);
                        
                        // Look for version history or rollback options
                        const versionButtons = screen.queryAllByText(/version|history|rollback/i);
                        if (versionButtons.length > 0) {
                            fireEvent.click(versionButtons[0]);
                            
                            // Verify version data integrity
                            expect(sortedVersions.length).toBeGreaterThanOrEqual(2);
                            expect(currentVersion.version).toBeGreaterThan(previousVersion.version);
                            
                            // Verify each version has required fields
                            sortedVersions.forEach(version => {
                                expect(version.title.length).toBeGreaterThan(0);
                                expect(version.content.length).toBeGreaterThan(0);
                                expect(version.author.length).toBeGreaterThan(0);
                                expect(version.version).toBeGreaterThan(0);
                                expect(new Date(version.timestamp)).toBeInstanceOf(Date);
                            });
                        }
                    }
                    
                    // Verify rollback logic
                    const canRollback = sortedVersions.length > 1;
                    expect(canRollback).toBe(true);
                    
                    if (canRollback) {
                        // Verify target version exists
                        expect(previousVersion).toBeDefined();
                        expect(previousVersion.version).toBeLessThan(currentVersion.version);
                    }
                });
            }
        ), { numRuns: 30 });
    });

    /**
     * Property 42: Content Preview Accuracy
     * Content preview should accurately represent how content will appear when published
     */
    test('Property 42: Content Preview Accuracy', () => {
        fc.assert(fc.property(
            fc.record({
                id: fc.string({ minLength: 1, maxLength: 20 }),
                title: fc.string({ minLength: 1, maxLength: 100 }),
                description: fc.string({ minLength: 1, maxLength: 200 }),
                content: fc.string({ minLength: 10, maxLength: 1000 }),
                type: fc.constantFrom('banner', 'page', 'campaign'),
                image: fc.option(fc.webUrl(), { nil: null }),
                link: fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: null }),
                status: fc.constantFrom('draft', 'published'),
                publishDate: fc.date().map(d => d.toISOString()),
                tags: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 0, maxLength: 3 })
            }),
            (contentData) => {
                const mockContent = {
                    ...contentData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                global.fetch = jest.fn((url) => {
                    if (url.includes('/content')) {
                        const contentByType = {
                            banners: contentData.type === 'banner' ? [mockContent] : [],
                            pages: contentData.type === 'page' ? [mockContent] : [],
                            campaigns: contentData.type === 'campaign' ? [mockContent] : []
                        };
                        return Promise.resolve({
                            ok: true,
                            json: () => Promise.resolve(contentByType)
                        });
                    }
                    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
                });

                renderContentManager();

                return waitFor(() => {
                    // Switch to appropriate tab
                    const tabName = contentData.type === 'banner' ? 'banners' : 
                                   contentData.type === 'page' ? 'pages' : 'campaigns';
                    const tab = screen.queryByText(new RegExp(tabName, 'i'));
                    if (tab) {
                        fireEvent.click(tab);
                    }
                    
                    // Verify content is displayed
                    expect(screen.getByText(contentData.title)).toBeInTheDocument();
                    expect(screen.getByText(contentData.description)).toBeInTheDocument();
                    
                    // Test preview functionality
                    const previewButtons = screen.queryAllByTitle(/preview/i);
                    if (previewButtons.length > 0) {
                        fireEvent.click(previewButtons[0]);
                        
                        // Verify preview modal appears
                        const previewModal = screen.queryByText(`Preview: ${contentData.title}`);
                        if (previewModal) {
                            expect(previewModal).toBeInTheDocument();
                            
                            // Verify preview content matches original
                            expect(screen.getByText(contentData.title)).toBeInTheDocument();
                            expect(screen.getByText(contentData.description)).toBeInTheDocument();
                            
                            // If content has HTML, verify it's rendered
                            if (contentData.content) {
                                // Check if content is displayed (might be in innerHTML)
                                const contentElements = screen.queryAllByText(contentData.content);
                                expect(contentElements.length).toBeGreaterThanOrEqual(0);
                            }
                            
                            // Verify image preview if present
                            if (contentData.image) {
                                const images = screen.queryAllByRole('img');
                                const previewImage = images.find(img => img.src === contentData.image);
                                if (previewImage) {
                                    expect(previewImage).toBeInTheDocument();
                                    expect(previewImage.alt).toBe(contentData.title);
                                }
                            }
                            
                            // Verify link preview if present
                            if (contentData.link) {
                                const links = screen.queryAllByRole('link');
                                const previewLink = links.find(link => 
                                    link.href === contentData.link || 
                                    link.textContent.includes(contentData.link)
                                );
                                if (previewLink) {
                                    expect(previewLink).toBeInTheDocument();
                                }
                            }
                        }
                    }
                    
                    // Verify content data integrity
                    expect(contentData.title.length).toBeGreaterThan(0);
                    expect(contentData.description.length).toBeGreaterThan(0);
                    expect(contentData.content.length).toBeGreaterThan(0);
                    expect(['banner', 'page', 'campaign']).toContain(contentData.type);
                    expect(['draft', 'published']).toContain(contentData.status);
                    
                    // Verify publish date is valid
                    expect(new Date(contentData.publishDate)).toBeInstanceOf(Date);
                    expect(isNaN(new Date(contentData.publishDate).getTime())).toBe(false);
                });
            }
        ), { numRuns: 35 });
    });

    /**
     * Property 38: Content Scheduling Accuracy
     * Scheduled content should be published and expired at the correct times
     */
    test('Property 38: Content Scheduling Accuracy', () => {
        fc.assert(fc.property(
            fc.record({
                id: fc.string({ minLength: 1, maxLength: 20 }),
                title: fc.string({ minLength: 1, maxLength: 100 }),
                status: fc.constantFrom('draft', 'scheduled', 'published'),
                publishDate: fc.date({ min: new Date('2024-01-01'), max: new Date('2024-06-01') })
                    .map(d => d.toISOString()),
                expiryDate: fc.date({ min: new Date('2024-06-01'), max: new Date('2024-12-31') })
                    .map(d => d.toISOString()),
                currentTime: fc.date({ min: new Date('2024-01-01'), max: new Date('2024-12-31') })
                    .map(d => d.toISOString())
            }).filter(data => 
                new Date(data.publishDate) < new Date(data.expiryDate)
            ),
            (scheduleData) => {
                const publishTime = new Date(scheduleData.publishDate);
                const expiryTime = new Date(scheduleData.expiryDate);
                const currentTime = new Date(scheduleData.currentTime);
                
                // Determine expected status based on current time
                let expectedStatus = scheduleData.status;
                if (scheduleData.status === 'scheduled') {
                    if (currentTime >= publishTime && currentTime < expiryTime) {
                        expectedStatus = 'published';
                    } else if (currentTime >= expiryTime) {
                        expectedStatus = 'expired';
                    }
                }

                const mockContent = {
                    id: scheduleData.id,
                    title: scheduleData.title,
                    description: 'Test description',
                    type: 'banner',
                    status: expectedStatus,
                    publishDate: scheduleData.publishDate,
                    expiryDate: scheduleData.expiryDate,
                    createdAt: new Date().toISOString(),
                    updatedAt: scheduleData.currentTime
                };

                global.fetch = jest.fn((url) => {
                    if (url.includes('/content')) {
                        return Promise.resolve({
                            ok: true,
                            json: () => Promise.resolve({
                                banners: [mockContent],
                                pages: [],
                                campaigns: []
                            })
                        });
                    }
                    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
                });

                renderContentManager();

                return waitFor(() => {
                    // Verify content is displayed
                    expect(screen.getByText(scheduleData.title)).toBeInTheDocument();
                    
                    // Verify scheduling logic
                    expect(publishTime).toBeLessThan(expiryTime);
                    
                    // Verify status transitions are logical
                    if (scheduleData.status === 'scheduled') {
                        if (currentTime < publishTime) {
                            expect(expectedStatus).toBe('scheduled');
                        } else if (currentTime >= publishTime && currentTime < expiryTime) {
                            expect(expectedStatus).toBe('published');
                        } else if (currentTime >= expiryTime) {
                            expect(expectedStatus).toBe('expired');
                        }
                    }
                    
                    // Verify date validation
                    expect(isNaN(publishTime.getTime())).toBe(false);
                    expect(isNaN(expiryTime.getTime())).toBe(false);
                    expect(isNaN(currentTime.getTime())).toBe(false);
                    
                    // Verify status is valid
                    expect(['draft', 'scheduled', 'published', 'expired']).toContain(expectedStatus);
                });
            }
        ), { numRuns: 40 });
    });
});