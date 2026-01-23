import React, { useState, useEffect } from 'react';
import {
    FiSettings,
    FiMail,
    FiCreditCard,
    FiTruck,
    FiPercent,
    FiSave,
    FiRefreshCw,
    FiDownload,
    FiUpload,
    FiDatabase,
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useAdminAuth } from '../../context/AdminAuthContext';
import './SettingsManager.css';

const SettingsManager = () => {
    const { hasPermission } = useAdminAuth();
    const [activeSection, setActiveSection] = useState('general');
    const [loading, setLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);

    // Default Settings state structure
    const defaultSettings = {
        general: {
            siteName: 'The Vanity India',
            siteDescription: 'Your premier destination for beauty products',
            contactEmail: 'contact@thevanityindia.com',
            supportEmail: 'support@thevanityindia.com',
            phoneNumber: '+91 98765 43210',
            address: '123 Beauty Street, Mumbai, Maharashtra 400001',
            timezone: 'Asia/Kolkata',
            currency: 'INR',
            language: 'en'
        },
        email: {
            smtpHost: 'smtp.gmail.com',
            smtpPort: 587,
            smtpUsername: 'noreply@thevanityindia.com',
            smtpPassword: '',
            fromName: 'The Vanity India',
            fromEmail: 'noreply@thevanityindia.com',
            enableEmailNotifications: true,
            orderConfirmationTemplate: 'order_confirmation',
            shippingNotificationTemplate: 'shipping_notification',
            welcomeEmailTemplate: 'welcome_email'
        },
        payment: {
            enableRazorpay: true,
            razorpayKeyId: '',
            razorpayKeySecret: '',
            enableStripe: false,
            stripePublishableKey: '',
            stripeSecretKey: '',
            enablePayPal: false,
            paypalClientId: '',
            paypalClientSecret: '',
            enableCOD: true,
            codCharges: 50,
            minimumOrderAmount: 500
        },
        shipping: {
            freeShippingThreshold: 999,
            standardShippingRate: 99,
            expressShippingRate: 199,
            enableInternationalShipping: false,
            internationalShippingRate: 999,
            processingTime: '1-2 business days',
            standardDeliveryTime: '3-5 business days',
            expressDeliveryTime: '1-2 business days',
            enableShippingCalculator: true,
            defaultWeight: 0.5,
            weightUnit: 'kg'
        },
        tax: {
            enableTax: true,
            defaultTaxRate: 18,
            gstNumber: '',
            taxInclusivePricing: true,
            enableStateTax: true,
            stateTaxRates: {
                'Maharashtra': 18,
                'Delhi': 18,
                'Karnataka': 18,
                'Tamil Nadu': 18,
                'Gujarat': 18
            },
            taxDisplayMode: 'inclusive'
        }
    };

    const [settings, setSettings] = useState(defaultSettings);

    const settingSections = {
        general: { label: 'General', icon: FiSettings },
        email: { label: 'Email', icon: FiMail },
        payment: { label: 'Payment', icon: FiCreditCard },
        shipping: { label: 'Shipping', icon: FiTruck },
        tax: { label: 'Tax', icon: FiPercent },
        backup: { label: 'Backup & Restore', icon: FiDatabase }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:5000/api/admin/settings', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    // Merge fetched settings with default settings to ensure all fields exist
                    const mergedSettings = { ...defaultSettings };

                    Object.keys(result.data).forEach(section => {
                        if (mergedSettings[section]) {
                            mergedSettings[section] = {
                                ...mergedSettings[section],
                                ...result.data[section]
                            };
                        }
                    });

                    // For nested objects like stateTaxRates or deeply nested configs, 
                    // we might need deep merge if the API returns partial updates, 
                    // but usually Settings API returns full section objects.

                    setSettings(mergedSettings);
                    setLastSaved(new Date());
                }
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSettingChange = (section, key, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
        setHasChanges(true);
    };

    // Keep this for deep nested updates if needed (e.g. stateTaxRates)
    const handleNestedSettingChange = (section, parentKey, childKey, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [parentKey]: {
                    ...prev[section][parentKey],
                    [childKey]: value
                }
            }
        }));
        setHasChanges(true);
    };

    const saveSettings = async () => {
        // We only save the currently active section or ALL sections?
        // Usually safer to save ALL changed sections, or just the active one if we want granular control.
        // Let's safe the currently active section for simplicity, or iterate through all.
        // But the button is "Save Changes" usually implies saving everything.
        // However, the API endpoint is per-section: PUT /api/admin/settings/:section

        if (!hasPermission('settings.write')) {
            toast.error('You do not have permission to save settings');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');

            // Save each section
            const sections = Object.keys(settings);
            const promises = sections.map(section => {
                return fetch(`http://localhost:5000/api/admin/settings/${section}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(settings[section])
                });
            });

            await Promise.all(promises);

            setHasChanges(false);
            setLastSaved(new Date());
            toast.success('Settings saved successfully');
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    const exportSettings = () => {
        const dataStr = JSON.stringify(settings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `settings-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success('Settings exported successfully');
    };

    const importSettings = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedSettings = JSON.parse(e.target.result);
                setSettings(prev => ({ ...prev, ...importedSettings }));
                setHasChanges(true);
                toast.success('Settings imported successfully. Click Save to apply.');
            } catch (error) {
                toast.error('Invalid settings file');
            }
        };
        reader.readAsText(file);
    };

    // ... Render functions ...
    const renderGeneralSettings = () => (
        <div className="settings-section">
            <h3>General Settings</h3>
            <div className="settings-grid">
                <div className="setting-group">
                    <label>Site Name</label>
                    <input
                        type="text"
                        value={settings.general.siteName}
                        onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                        className="setting-input"
                    />
                </div>

                <div className="setting-group">
                    <label>Contact Email</label>
                    <input
                        type="email"
                        value={settings.general.contactEmail}
                        onChange={(e) => handleSettingChange('general', 'contactEmail', e.target.value)}
                        className="setting-input"
                    />
                </div>

                <div className="setting-group full-width">
                    <label>Site Description</label>
                    <textarea
                        value={settings.general.siteDescription}
                        onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
                        className="setting-textarea"
                        rows="3"
                    />
                </div>

                <div className="setting-group">
                    <label>Support Email</label>
                    <input
                        type="email"
                        value={settings.general.supportEmail}
                        onChange={(e) => handleSettingChange('general', 'supportEmail', e.target.value)}
                        className="setting-input"
                    />
                </div>

                <div className="setting-group">
                    <label>Phone Number</label>
                    <input
                        type="tel"
                        value={settings.general.phoneNumber}
                        onChange={(e) => handleSettingChange('general', 'phoneNumber', e.target.value)}
                        className="setting-input"
                    />
                </div>

                <div className="setting-group full-width">
                    <label>Address</label>
                    <textarea
                        value={settings.general.address}
                        onChange={(e) => handleSettingChange('general', 'address', e.target.value)}
                        className="setting-textarea"
                        rows="2"
                    />
                </div>

                <div className="setting-group">
                    <label>Timezone</label>
                    <select
                        value={settings.general.timezone}
                        onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                        className="setting-input"
                    >
                        <option value="Asia/Kolkata">Asia/Kolkata</option>
                        <option value="Asia/Mumbai">Asia/Mumbai</option>
                        <option value="Asia/Delhi">Asia/Delhi</option>
                    </select>
                </div>

                <div className="setting-group">
                    <label>Currency</label>
                    <select
                        value={settings.general.currency}
                        onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
                        className="setting-input"
                    >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderEmailSettings = () => (
        <div className="settings-section">
            <div className="section-header">
                <h3>Email Settings</h3>
            </div>
            <div className="settings-grid">
                <div className="setting-group">
                    <label>SMTP Host</label>
                    <input
                        type="text"
                        value={settings.email.smtpHost}
                        onChange={(e) => handleSettingChange('email', 'smtpHost', e.target.value)}
                        className="setting-input"
                    />
                </div>

                <div className="setting-group">
                    <label>SMTP Port</label>
                    <input
                        type="number"
                        value={settings.email.smtpPort}
                        onChange={(e) => handleSettingChange('email', 'smtpPort', parseInt(e.target.value) || 0)}
                        className="setting-input"
                    />
                </div>

                <div className="setting-group">
                    <label>SMTP Username</label>
                    <input
                        type="email"
                        value={settings.email.smtpUsername}
                        onChange={(e) => handleSettingChange('email', 'smtpUsername', e.target.value)}
                        className="setting-input"
                    />
                </div>

                <div className="setting-group">
                    <label>SMTP Password</label>
                    <input
                        type="password"
                        value={settings.email.smtpPassword}
                        onChange={(e) => handleSettingChange('email', 'smtpPassword', e.target.value)}
                        className="setting-input"
                        placeholder="Enter password"
                    />
                </div>

                <div className="setting-group">
                    <label>From Name</label>
                    <input
                        type="text"
                        value={settings.email.fromName}
                        onChange={(e) => handleSettingChange('email', 'fromName', e.target.value)}
                        className="setting-input"
                    />
                </div>

                <div className="setting-group">
                    <label>From Email</label>
                    <input
                        type="email"
                        value={settings.email.fromEmail}
                        onChange={(e) => handleSettingChange('email', 'fromEmail', e.target.value)}
                        className="setting-input"
                    />
                </div>

                <div className="setting-group full-width">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={settings.email.enableEmailNotifications}
                            onChange={(e) => handleSettingChange('email', 'enableEmailNotifications', e.target.checked)}
                        />
                        <span>Enable Email Notifications</span>
                    </label>
                </div>
            </div>
        </div>
    );

    const renderPaymentSettings = () => (
        <div className="settings-section">
            <h3>Payment Gateway Settings</h3>
            <div className="payment-gateways">
                {/* Razorpay */}
                <div className="gateway-section">
                    <div className="gateway-header">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={settings.payment.enableRazorpay}
                                onChange={(e) => handleSettingChange('payment', 'enableRazorpay', e.target.checked)}
                            />
                            <span>Enable Razorpay</span>
                        </label>
                    </div>
                    {settings.payment.enableRazorpay && (
                        <div className="gateway-config">
                            <div className="setting-group">
                                <label>Razorpay Key ID</label>
                                <input
                                    type="text"
                                    value={settings.payment.razorpayKeyId}
                                    onChange={(e) => handleSettingChange('payment', 'razorpayKeyId', e.target.value)}
                                    className="setting-input"
                                />
                            </div>
                            <div className="setting-group">
                                <label>Razorpay Key Secret</label>
                                <input
                                    type="password"
                                    value={settings.payment.razorpayKeySecret}
                                    onChange={(e) => handleSettingChange('payment', 'razorpayKeySecret', e.target.value)}
                                    className="setting-input"
                                    placeholder="Enter secret key"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Cash on Delivery */}
                <div className="gateway-section">
                    <div className="gateway-header">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={settings.payment.enableCOD}
                                onChange={(e) => handleSettingChange('payment', 'enableCOD', e.target.checked)}
                            />
                            <span>Enable Cash on Delivery</span>
                        </label>
                    </div>
                    {settings.payment.enableCOD && (
                        <div className="gateway-config">
                            <div className="setting-group">
                                <label>COD Charges (₹)</label>
                                <input
                                    type="number"
                                    value={settings.payment.codCharges}
                                    onChange={(e) => handleSettingChange('payment', 'codCharges', parseFloat(e.target.value) || 0)}
                                    className="setting-input"
                                />
                            </div>
                            <div className="setting-group">
                                <label>Minimum Order Amount (₹)</label>
                                <input
                                    type="number"
                                    value={settings.payment.minimumOrderAmount}
                                    onChange={(e) => handleSettingChange('payment', 'minimumOrderAmount', parseFloat(e.target.value) || 0)}
                                    className="setting-input"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderShippingSettings = () => (
        <div className="settings-section">
            <h3>Shipping Settings</h3>
            <div className="settings-grid">
                <div className="setting-group">
                    <label>Free Shipping Threshold (₹)</label>
                    <input
                        type="number"
                        value={settings.shipping.freeShippingThreshold}
                        onChange={(e) => handleSettingChange('shipping', 'freeShippingThreshold', parseFloat(e.target.value) || 0)}
                        className="setting-input"
                    />
                </div>

                <div className="setting-group">
                    <label>Standard Shipping Rate (₹)</label>
                    <input
                        type="number"
                        value={settings.shipping.standardShippingRate}
                        onChange={(e) => handleSettingChange('shipping', 'standardShippingRate', parseFloat(e.target.value) || 0)}
                        className="setting-input"
                    />
                </div>

                <div className="setting-group">
                    <label>Express Shipping Rate (₹)</label>
                    <input
                        type="number"
                        value={settings.shipping.expressShippingRate}
                        onChange={(e) => handleSettingChange('shipping', 'expressShippingRate', parseFloat(e.target.value) || 0)}
                        className="setting-input"
                    />
                </div>

                <div className="setting-group">
                    <label>Processing Time</label>
                    <input
                        type="text"
                        value={settings.shipping.processingTime}
                        onChange={(e) => handleSettingChange('shipping', 'processingTime', e.target.value)}
                        className="setting-input"
                    />
                </div>

                <div className="setting-group">
                    <label>Standard Delivery Time</label>
                    <input
                        type="text"
                        value={settings.shipping.standardDeliveryTime}
                        onChange={(e) => handleSettingChange('shipping', 'standardDeliveryTime', e.target.value)}
                        className="setting-input"
                    />
                </div>

                <div className="setting-group">
                    <label>Express Delivery Time</label>
                    <input
                        type="text"
                        value={settings.shipping.expressDeliveryTime}
                        onChange={(e) => handleSettingChange('shipping', 'expressDeliveryTime', e.target.value)}
                        className="setting-input"
                    />
                </div>

                <div className="setting-group full-width">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={settings.shipping.enableInternationalShipping}
                            onChange={(e) => handleSettingChange('shipping', 'enableInternationalShipping', e.target.checked)}
                        />
                        <span>Enable International Shipping</span>
                    </label>
                </div>
            </div>
        </div>
    );

    const renderTaxSettings = () => (
        <div className="settings-section">
            <h3>Tax Settings</h3>
            <div className="settings-grid">
                <div className="setting-group full-width">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={settings.tax.enableTax}
                            onChange={(e) => handleSettingChange('tax', 'enableTax', e.target.checked)}
                        />
                        <span>Enable Tax Calculation</span>
                    </label>
                </div>

                {settings.tax.enableTax && (
                    <>
                        <div className="setting-group">
                            <label>Default Tax Rate (%)</label>
                            <input
                                type="number"
                                value={settings.tax.defaultTaxRate}
                                onChange={(e) => handleSettingChange('tax', 'defaultTaxRate', parseFloat(e.target.value) || 0)}
                                className="setting-input"
                                step="0.01"
                            />
                        </div>

                        <div className="setting-group">
                            <label>GST Number</label>
                            <input
                                type="text"
                                value={settings.tax.gstNumber}
                                onChange={(e) => handleSettingChange('tax', 'gstNumber', e.target.value)}
                                className="setting-input"
                            />
                        </div>

                        <div className="setting-group">
                            <label>Tax Display Mode</label>
                            <select
                                value={settings.tax.taxDisplayMode}
                                onChange={(e) => handleSettingChange('tax', 'taxDisplayMode', e.target.value)}
                                className="setting-input"
                            >
                                <option value="inclusive">Tax Inclusive</option>
                                <option value="exclusive">Tax Exclusive</option>
                            </select>
                        </div>

                        <div className="setting-group full-width">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={settings.tax.taxInclusivePricing}
                                    onChange={(e) => handleSettingChange('tax', 'taxInclusivePricing', e.target.checked)}
                                >
                                </input>
                                <span>Tax Inclusive Pricing</span>
                            </label>
                        </div>
                    </>
                )}
            </div>
        </div>
    );

    const renderBackupSettings = () => (
        <div className="settings-section">
            <h3>Backup & Restore Settings</h3>
            <div className="backup-actions">
                <button
                    className="btn btn-secondary"
                    onClick={exportSettings}
                >
                    <FiDownload />
                    Export Settings
                </button>
                <label className="btn btn-secondary">
                    <FiUpload />
                    Import Settings
                    <input
                        type="file"
                        accept=".json"
                        onChange={importSettings}
                        style={{ display: 'none' }}
                    />
                </label>
            </div>

            <p className="description-text">
                Export your current settings to a JSON file as a backup, or restore settings from a previously exported file.
            </p>
        </div>
    );

    return (
        <div className="settings-manager">
            <div className="settings-sidebar">
                <div className="settings-sidebar-header">
                    <h2>Settings</h2>
                </div>
                <nav className="settings-nav">
                    {Object.entries(settingSections).map(([key, { label, icon: Icon }]) => (
                        <button
                            key={key}
                            className={`settings-nav-item ${activeSection === key ? 'active' : ''}`}
                            onClick={() => setActiveSection(key)}
                        >
                            <Icon />
                            <span>{label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            <div className="settings-content">
                <div className="settings-header">
                    <div className="header-left">
                        <h2>{settingSections[activeSection].label}</h2>
                        {lastSaved && (
                            <span className="last-saved">
                                Last saved: {lastSaved.toLocaleTimeString()}
                            </span>
                        )}
                    </div>
                    <button
                        className={`save-btn ${hasChanges ? 'has-changes' : ''}`}
                        onClick={saveSettings}
                        disabled={loading && !hasChanges}
                    >
                        {loading ? <FiRefreshCw className="spinning" /> : <FiSave />}
                        <span>Save Changes</span>
                    </button>
                </div>

                <div className="settings-body">
                    {activeSection === 'general' && renderGeneralSettings()}
                    {activeSection === 'email' && renderEmailSettings()}
                    {activeSection === 'payment' && renderPaymentSettings()}
                    {activeSection === 'shipping' && renderShippingSettings()}
                    {activeSection === 'tax' && renderTaxSettings()}
                    {activeSection === 'backup' && renderBackupSettings()}
                </div>
            </div>
        </div>
    );
};

export default SettingsManager;