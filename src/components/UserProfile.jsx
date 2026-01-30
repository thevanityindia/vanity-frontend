import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { INDIAN_STATES, validatePhone, fetchLocationFromPincode } from '../utils/locationUtils';
import { FaMapMarkerAlt } from 'react-icons/fa';
import API_BASE_URL from '../config';
import './UserProfile.css';

const UserProfile = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        phone: '',
        isDefault: false
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchUserData();
    }, [isAuthenticated]);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success) {
                setProfileData({
                    firstName: data.data.firstName,
                    lastName: data.data.lastName,
                    email: data.data.email,
                    phone: data.data.phone || ''
                });
                setAddresses(data.data.addresses || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();

        if (profileData.phone && !validatePhone(profileData.phone)) {
            toast.error('Please enter a valid 10-digit Indian phone number (starting with 6-9)');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Profile updated successfully');
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error('Update failed');
        }
    };

    const handlePincodeChange = async (e) => {
        const code = e.target.value;
        setNewAddress({ ...newAddress, postalCode: code });

        if (code.length === 6) {
            const location = await fetchLocationFromPincode(code);
            if (location) {
                setNewAddress(prev => ({
                    ...prev,
                    city: location.city,
                    state: location.state
                }));
                toast.success(`Location detected: ${location.city}, ${location.state}`);
            } else {
                toast.error('Could not detect location for this pincode.');
            }
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();

        if (!validatePhone(newAddress.phone)) {
            toast.error('Please enter a valid 10-digit phone number');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/users/addresses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newAddress)
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Address added');
                setAddresses(data.data);
                setShowAddressForm(false);
                setNewAddress({
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    address1: '',
                    address2: '',
                    city: '',
                    state: '',
                    postalCode: '',
                    country: 'India',
                    phone: profileData.phone,
                    isDefault: false
                });
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error('Failed to add address');
        }
    };

    const handleDeleteAddress = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/users/addresses/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setAddresses(data.data);
                toast.success('Address deleted');
            }
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="user-profile">
            <div className="profile-sidebar">
                <div className="profile-header">
                    <div className="profile-bg">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <h3>{user?.firstName} {user?.lastName}</h3>
                    <p className="profile-email">{user?.email}</p>
                    <button onClick={logout} className="logout-btn header-logout">Logout</button>
                </div>

                <div className="profile-nav">
                    <button
                        className={activeTab === 'profile' ? 'active' : ''}
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile Information
                    </button>
                    <button
                        className={activeTab === 'addresses' ? 'active' : ''}
                        onClick={() => setActiveTab('addresses')}
                    >
                        Saved Addresses
                    </button>
                    <button onClick={() => navigate('/orders')}>Order History</button>
                </div>
            </div>

            <div className="profile-content">
                {activeTab === 'profile' && (
                    <div>
                        <h2 className="section-title">Profile Information</h2>
                        <form onSubmit={handleProfileUpdate}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        value={profileData.firstName}
                                        onChange={e => setProfileData({ ...profileData, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        value={profileData.lastName}
                                        onChange={e => setProfileData({ ...profileData, lastName: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" value={profileData.email} disabled className="input-disabled" />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="text"
                                        value={profileData.phone}
                                        onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn-primary">Save Changes</button>
                        </form>
                    </div>
                )}

                {activeTab === 'addresses' && (
                    <div>
                        <h2 className="section-title">Saved Addresses</h2>

                        {!showAddressForm ? (
                            <>
                                {addresses.map(addr => (
                                    <div key={addr._id} className={`address-card ${addr.isDefault ? 'default' : ''}`}>
                                        {addr.isDefault && <span className="address-badge">Default</span>}
                                        <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{addr.firstName} {addr.lastName}</div>
                                        <div>{addr.address1}</div>
                                        {addr.address2 && <div>{addr.address2}</div>}
                                        <div>{addr.city}, {addr.state} {addr.postalCode}</div>
                                        <div className="address-card-phone">Phone: {addr.phone}</div>
                                        <div className="address-card-actions">
                                            <button
                                                onClick={() => handleDeleteAddress(addr._id)}
                                                className="delete-address-btn"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button className="add-address-btn" onClick={() => {
                                    setNewAddress({
                                        ...newAddress,
                                        firstName: profileData.firstName,
                                        lastName: profileData.lastName,
                                        phone: profileData.phone
                                    });
                                    setShowAddressForm(true);
                                }}>
                                    + Add New Address
                                </button>
                            </>
                        ) : (
                            <form onSubmit={handleAddAddress}>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input
                                            value={newAddress.firstName}
                                            onChange={e => setNewAddress({ ...newAddress, firstName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input
                                            value={newAddress.lastName}
                                            onChange={e => setNewAddress({ ...newAddress, lastName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Address Line 1</label>
                                        <input
                                            value={newAddress.address1}
                                            onChange={e => setNewAddress({ ...newAddress, address1: e.target.value })}
                                            required
                                            placeholder="Street address, P.O. box, etc."
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Address Line 2 (Optional)</label>
                                        <input
                                            value={newAddress.address2}
                                            onChange={e => setNewAddress({ ...newAddress, address2: e.target.value })}
                                            placeholder="Apartment, suite, unit, etc."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>City</label>
                                        <input
                                            value={newAddress.city}
                                            onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                            required
                                            placeholder="Auto-detects from PIN"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>State</label>
                                        <select
                                            value={newAddress.state}
                                            onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                                            required
                                            className="form-select"
                                        >
                                            <option value="">Select State</option>
                                            {INDIAN_STATES.map(state => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>PIN Code</label>
                                        <div className="pincode-wrapper">
                                            <input
                                                value={newAddress.postalCode}
                                                onChange={handlePincodeChange}
                                                maxLength={6}
                                                required
                                                placeholder="Enter 6-digit PIN"
                                            />
                                            {newAddress.postalCode.length === 6 && (
                                                <span className="pincode-success">
                                                    ✓
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Phone</label>
                                        <input
                                            value={newAddress.phone}
                                            onChange={e => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                setNewAddress({ ...newAddress, phone: val });
                                            }}
                                            type="tel"
                                            required
                                            placeholder="10-digit mobile number"
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label className="location-label">
                                            <FaMapMarkerAlt /> Precise Location (Optional)
                                        </label>
                                        <div className="location-help-text">
                                            To use precise GPS location, please <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">open Google Maps</a>, find your location, and verify your address details above match.
                                        </div>
                                    </div>
                                </div>
                                <div className="checkbox-group">
                                    <input
                                        type="checkbox"
                                        id="isDefault"
                                        checked={newAddress.isDefault}
                                        onChange={e => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                                    />
                                    <label htmlFor="isDefault">Set as default address</label>
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn-primary">Save Address</button>
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => setShowAddressForm(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
