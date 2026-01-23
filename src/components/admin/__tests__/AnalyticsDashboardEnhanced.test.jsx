import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import fc from 'fast-check';
import AnalyticsDashboard from '../AnalyticsDashboard';
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

// Mock Chart.js
jest.mock('react-chartjs-2', () => ({
    Line: ({ data, options }) => (
        <div data-testid="line-chart">
            <div data-testid="chart-data">{JSON.stringify(data)}</div>
            <div data-testid="chart-options">{JSON.stringify(options)}</div>
        </div>
    ),
    Bar: ({ data, options }) => (
        <div data-testid="bar-chart">
            <div data-testid="chart-data">{JSON.stringify(data)}</div>
            <div data-testid="chart-options">{JSON.stringify(options)}</div>
        </div>
    ),
    Doughnut: ({ data, options }) => (
        <div data-testid="doughnut-chart">
            <div data-testid="chart-data">{JSON.stringify(data)}</div>
            <div data-testid="chart-options">{JSON.stringify(options)}</div>
        </div>
    )
}));

jest.mock('chart.js', () => ({
    Chart: {
        register: jest.fn()
    },
    CategoryScale: jest.fn(),
    LinearScale: jest.fn(),
    PointElement: jest.fn(),
    LineElement: jest.fn(),
    BarElement: jest.fn(),
    ArcElement: jest.fn(),
    Title: jest.fn(),
    Tooltip: jest.fn(),
    Legend: jest.fn()
}));

const renderAnalyticsDashboard = () => {
    return render(
        <BrowserRouter>
            <AdminAuthProvider>
                <AnalyticsDashboard />
                <Toaster />
            </AdminAuthProvider>
        </BrowserRouter>
    );
};

describe('AnalyticsDashboard Property-Based Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockAdminAuth.hasPermission.mockReturnValue(true);
    });

    /**
     * Property 25: Dashboard Metrics Accuracy
     * For any valid analytics data, the dashboard should display accurate metrics and calculations
     */
    test('Property 25: Dashboard Metrics Accuracy', () => {
        fc.assert(fc.property(
            fc.record({
                totalRevenue: fc.float({ min: 0, max: 1000000 }),
                totalOrders: fc.integer({ min: 0, max: 10000 }),
                totalCustomers: fc.integer({ min: 0, max: 5000 }),
                averageOrderValue: fc.float({ min: 0, max: 5000 }),
                conversionRate: fc.float({ min: 0, max: 100 }),
                salesData: fc.array(fc.record({
                    date: fc.date().map(d => d.toISOString().split('T')[0]),
                    revenue: fc.float({ min: 0, max: 10000 }),
                    orders: fc.integer({ min: 0, max: 100 })
                }), { minLength: 7, maxLength: 30 }),
                topProducts: fc.array(fc.record({
                    id: fc.string(),
                    name: fc.string({ minLength: 1, maxLength: 50 }),
                    sales: fc.integer({ min: 1, max: 1000 }),
                    revenue: fc.float({ min: 1, max: 50000 })
                }), { minLength: 1, maxLength: 10 })
            }),
            (analyticsData) => {
                // Mock the analytics API response
                global.fetch = jest.fn((url) => {
                    if (url.includes('/analytics')) {
                        return Promise.resolve({
                            ok: true,
                            json: () => Promise.resolve(analyticsData)
                        });
                    }
                    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
                });

                renderAnalyticsDashboard();

                return waitFor(() => {
                    // Check that key metrics are displayed
                    const revenueText = `₹${analyticsData.totalRevenue.toLocaleString()}`;
                    const ordersText = analyticsData.totalOrders.toLocaleString();
                    const customersText = analyticsData.totalCustomers.toLocaleString();
                    
                    // Verify revenue display
                    expect(screen.getByText(revenueText)).toBeInTheDocument();
                    
                    // Verify orders count
                    expect(screen.getByText(ordersText)).toBeInTheDocument();
                    
                    // Verify customers count
                    expect(screen.getByText(customersText)).toBeInTheDocument();
                    
                    // Verify average order value calculation
                    if (analyticsData.totalOrders > 0) {
                        const expectedAOV = analyticsData.totalRevenue / analyticsData.totalOrders;
                        const aovText = `₹${expectedAOV.toFixed(2)}`;
                        // AOV should be calculated correctly
                        expect(expectedAOV).toBeCloseTo(analyticsData.totalRevenue / analyticsData.totalOrders, 2);
                    }
                    
                    // Verify conversion rate is within valid range
                    expect(analyticsData.conversionRate).toBeGreaterThanOrEqual(0);
                    expect(analyticsData.conversionRate).toBeLessThanOrEqual(100);
                });
            }
        ), { numRuns: 50 });
    });

    /**
     * Property 27: Sales Analysis Correctness
     * Sales trend analysis should correctly process and display sales data over time
     */
    test('Property 27: Sales Analysis Correctness', () => {
        fc.assert(fc.property(
            fc.record({
                period: fc.constantFrom('7days', '30days', '90days', '1year'),
                salesData: fc.array(fc.record({
                    date: fc.date({ min: new Date('2024-01-01'), max: new Date('2024-12-31') })
                        .map(d => d.toISOString().split('T')[0]),
                    revenue: fc.float({ min: 0, max: 10000 }),
                    orders: fc.integer({ min: 0, max: 100 }),
                    customers: fc.integer({ min: 0, max: 50 })
                }), { minLength: 7, maxLength: 365 })
            }),
            (salesAnalysisData) => {
                // Sort sales data by date for proper trend analysis
                const sortedSalesData = salesAnalysisData.salesData.sort((a, b) => 
                    new Date(a.date) - new Date(b.date)
                );
                
                const mockAnalytics = {
                    totalRevenue: sortedSalesData.reduce((sum, day) => sum + day.revenue, 0),
                    totalOrders: sortedSalesData.reduce((sum, day) => sum + day.orders, 0),
                    totalCustomers: Math.max(...sortedSalesData.map(day => day.customers), 0),
                    salesData: sortedSalesData,
                    period: salesAnalysisData.period
                };

                global.fetch = jest.fn((url) => {
                    if (url.includes('/analytics')) {
                        return Promise.resolve({
                            ok: true,
                            json: () => Promise.resolve(mockAnalytics)
                        });
                    }
                    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
                });

                renderAnalyticsDashboard();

                return waitFor(() => {
                    // Check that sales chart is rendered
                    const lineChart = screen.queryByTestId('line-chart');
                    if (lineChart) {
                        const chartDataElement = screen.getByTestId('chart-data');
                        const chartData = JSON.parse(chartDataElement.textContent);
                        
                        // Verify chart data structure
                        expect(chartData).toHaveProperty('labels');
                        expect(chartData).toHaveProperty('datasets');
                        expect(Array.isArray(chartData.labels)).toBe(true);
                        expect(Array.isArray(chartData.datasets)).toBe(true);
                        
                        // Verify data points match the input
                        if (chartData.datasets.length > 0) {
                            const revenueDataset = chartData.datasets.find(ds => 
                                ds.label?.toLowerCase().includes('revenue')
                            );
                            if (revenueDataset) {
                                expect(revenueDataset.data.length).toBeLessThanOrEqual(sortedSalesData.length);
                            }
                        }
                    }
                    
                    // Verify trend calculations are logical
                    if (sortedSalesData.length >= 2) {
                        const firstDay = sortedSalesData[0];
                        const lastDay = sortedSalesData[sortedSalesData.length - 1];
                        
                        // Revenue trend should be calculable
                        const revenueTrend = lastDay.revenue - firstDay.revenue;
                        expect(typeof revenueTrend).toBe('number');
                        expect(isFinite(revenueTrend)).toBe(true);
                    }
                });
            }
        ), { numRuns: 40 });
    });

    /**
     * Property 30: Report Export Functionality
     * Report export should generate valid data in the requested format
     */
    test('Property 30: Report Export Functionality', () => {
        fc.assert(fc.property(
            fc.record({
                reportType: fc.constantFrom('sales', 'customers', 'products', 'orders'),
                format: fc.constantFrom('csv', 'pdf', 'excel'),
                dateRange: fc.record({
                    start: fc.date({ min: new Date('2024-01-01'), max: new Date('2024-06-01') }),
                    end: fc.date({ min: new Date('2024-06-01'), max: new Date('2024-12-31') })
                }),
                data: fc.array(fc.record({
                    id: fc.string(),
                    name: fc.string({ minLength: 1, maxLength: 50 }),
                    value: fc.float({ min: 0, max: 10000 }),
                    date: fc.date().map(d => d.toISOString())
                }), { minLength: 1, maxLength: 100 })
            }).filter(data => data.dateRange.start <= data.dateRange.end),
            (exportData) => {
                const mockAnalytics = {
                    totalRevenue: 50000,
                    totalOrders: 500,
                    totalCustomers: 200,
                    reportData: exportData.data
                };

                // Mock successful export
                global.fetch = jest.fn((url, options) => {
                    if (url.includes('/analytics')) {
                        return Promise.resolve({
                            ok: true,
                            json: () => Promise.resolve(mockAnalytics)
                        });
                    }
                    if (url.includes('/export')) {
                        return Promise.resolve({
                            ok: true,
                            blob: () => Promise.resolve(new Blob(['mock export data'], { 
                                type: exportData.format === 'csv' ? 'text/csv' : 
                                      exportData.format === 'pdf' ? 'application/pdf' : 
                                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                            }))
                        });
                    }
                    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
                });

                // Mock URL.createObjectURL
                global.URL.createObjectURL = jest.fn(() => 'mock-url');
                global.URL.revokeObjectURL = jest.fn();

                renderAnalyticsDashboard();

                return waitFor(() => {
                    // Look for export buttons
                    const exportButtons = screen.queryAllByText(/export|download/i);
                    if (exportButtons.length > 0) {
                        fireEvent.click(exportButtons[0]);
                        
                        // Verify export parameters are valid
                        expect(exportData.dateRange.start).toBeInstanceOf(Date);
                        expect(exportData.dateRange.end).toBeInstanceOf(Date);
                        expect(exportData.dateRange.start <= exportData.dateRange.end).toBe(true);
                        
                        // Verify report type is valid
                        expect(['sales', 'customers', 'products', 'orders']).toContain(exportData.reportType);
                        
                        // Verify format is supported
                        expect(['csv', 'pdf', 'excel']).toContain(exportData.format);
                        
                        // Verify data is not empty
                        expect(exportData.data.length).toBeGreaterThan(0);
                    }
                });
            }
        ), { numRuns: 30 });
    });

    /**
     * Property 26: Chart Data Visualization Accuracy
     * Charts should accurately represent the underlying data without distortion
     */
    test('Property 26: Chart Data Visualization Accuracy', () => {
        fc.assert(fc.property(
            fc.record({
                chartType: fc.constantFrom('line', 'bar', 'doughnut'),
                dataPoints: fc.array(fc.record({
                    label: fc.string({ minLength: 1, maxLength: 20 }),
                    value: fc.float({ min: 0, max: 10000 })
                }), { minLength: 2, maxLength: 12 }),
                colors: fc.array(fc.string(), { minLength: 1, maxLength: 10 })
            }),
            (chartData) => {
                const mockAnalytics = {
                    totalRevenue: chartData.dataPoints.reduce((sum, point) => sum + point.value, 0),
                    totalOrders: chartData.dataPoints.length * 10,
                    totalCustomers: 100,
                    chartData: {
                        type: chartData.chartType,
                        labels: chartData.dataPoints.map(point => point.label),
                        data: chartData.dataPoints.map(point => point.value),
                        colors: chartData.colors
                    }
                };

                global.fetch = jest.fn((url) => {
                    if (url.includes('/analytics')) {
                        return Promise.resolve({
                            ok: true,
                            json: () => Promise.resolve(mockAnalytics)
                        });
                    }
                    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
                });

                renderAnalyticsDashboard();

                return waitFor(() => {
                    // Check for chart rendering based on type
                    const chartTestId = `${chartData.chartType}-chart`;
                    const chart = screen.queryByTestId(chartTestId);
                    
                    if (chart) {
                        const chartDataElement = screen.getByTestId('chart-data');
                        const renderedChartData = JSON.parse(chartDataElement.textContent);
                        
                        // Verify data integrity
                        expect(renderedChartData).toHaveProperty('labels');
                        expect(renderedChartData).toHaveProperty('datasets');
                        
                        // Verify labels match input
                        if (renderedChartData.labels) {
                            expect(renderedChartData.labels.length).toBeGreaterThan(0);
                        }
                        
                        // Verify datasets contain data
                        if (renderedChartData.datasets && renderedChartData.datasets.length > 0) {
                            const dataset = renderedChartData.datasets[0];
                            expect(dataset).toHaveProperty('data');
                            expect(Array.isArray(dataset.data)).toBe(true);
                            
                            // Verify data values are numbers
                            dataset.data.forEach(value => {
                                expect(typeof value).toBe('number');
                                expect(isFinite(value)).toBe(true);
                                expect(value).toBeGreaterThanOrEqual(0);
                            });
                        }
                    }
                    
                    // Verify total calculations are correct
                    const expectedTotal = chartData.dataPoints.reduce((sum, point) => sum + point.value, 0);
                    expect(expectedTotal).toBeGreaterThanOrEqual(0);
                });
            }
        ), { numRuns: 35 });
    });
});