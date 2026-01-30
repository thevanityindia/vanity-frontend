import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiClock, FiNavigation, FiSearch } from 'react-icons/fi';
import './StoresPage.css';

const StoresPage = () => {
    const [selectedCity, setSelectedCity] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const stores = [
        {
            id: 1,
            name: "The Vanity India - Vasai",
            address: "Office no 120, 1st Floor, Hilton Arcade, Opp-Tanish NX Salon, Evershine, Vasai East - 401208",
            phone: "+91 9112233165",
            mapLink: "https://maps.google.com/?q=Office no 120, 1st Floor, Hilton Arcade, Opp-Tanish NX Salon, Evershine, Vasai East - 401208",
            city: "Vasai",
            timings: "10:00 AM - 9:00 PM",
            services: ["Beauty Consultation", "Makeup Trial", "Skin Analysis", "Product Demo"],
            features: ["Air Conditioned", "Parking Available", "Expert Consultation"]
        }
    ];

    const cities = ['all', 'Vasai'];

    const filteredStores = stores.filter(store => {
        const matchesCity = selectedCity === 'all' || store.city === selectedCity;
        const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            store.city.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCity && matchesSearch;
    });

    return (
        <div className="stores-page">
            <div className="stores-container">
                <div className="stores-header">
                    <h1>Find a Store</h1>
                    <p className="page-subtitle">Visit our stores for personalized beauty consultations and product trials</p>
                </div>

                <div className="stores-content">
                    <section className="content-section">
                        <div className="store-filters">
                            <div className="filter-group">
                                <div className="search-box">
                                    <FiSearch className="search-icon" />
                                    <input
                                        type="text"
                                        placeholder="Search by store name, city, or area..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="search-input"
                                    />
                                </div>
                                <select
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="city-filter"
                                >
                                    {cities.map(city => (
                                        <option key={city} value={city}>
                                            {city === 'all' ? 'All Cities' : city}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Our Store Locations ({filteredStores.length})</h2>
                        <div className="stores-grid">
                            {filteredStores.map(store => (
                                <div key={store.id} className="store-card">
                                    <div className="store-header">
                                        <h3>{store.name}</h3>
                                        <span className="city-badge">{store.city}</span>
                                    </div>

                                    <div className="store-info">
                                        <div className="info-item">
                                            <FiMapPin className="info-icon" />
                                            <p>{store.address}</p>
                                        </div>

                                        <div className="info-item">
                                            <FiPhone className="info-icon" />
                                            <p>{store.phone}</p>
                                        </div>

                                        <div className="info-item">
                                            <FiClock className="info-icon" />
                                            <p>{store.timings}</p>
                                        </div>
                                    </div>

                                    <div className="store-services">
                                        <h4>Services Available</h4>
                                        <div className="services-list">
                                            {store.services.map((service, index) => (
                                                <span key={index} className="service-tag">{service}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="store-features">
                                        <h4>Features</h4>
                                        <div className="features-list">
                                            {store.features.map((feature, index) => (
                                                <span key={index} className="feature-tag">✓ {feature}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="store-actions">
                                        <button
                                            className="action-btn primary"
                                            onClick={() => window.open(store.mapLink, '_blank')}
                                        >
                                            <FiNavigation />
                                            Get Directions
                                        </button>
                                        <button
                                            className="action-btn secondary"
                                            onClick={() => window.location.href = `tel:${store.phone.replace(/\s+/g, '')}`}
                                        >
                                            <FiPhone />
                                            Call Store
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredStores.length === 0 && (
                            <div className="no-stores">
                                <p>No stores found matching your criteria. Try adjusting your search or filter.</p>
                            </div>
                        )}
                    </section>

                    <section className="content-section">
                        <h2>Store Services</h2>
                        <div className="services-grid">
                            <div className="service-card">
                                <h3>💄 Beauty Consultation</h3>
                                <p>Get personalized beauty advice from our expert consultants</p>
                                <ul>
                                    <li>Skin type analysis</li>
                                    <li>Product recommendations</li>
                                    <li>Color matching</li>
                                    <li>Routine planning</li>
                                </ul>
                            </div>

                            <div className="service-card">
                                <h3>✨ Makeup Trial</h3>
                                <p>Try before you buy with our complimentary makeup trials</p>
                                <ul>
                                    <li>Foundation matching</li>
                                    <li>Complete look creation</li>
                                    <li>Product testing</li>
                                    <li>Application techniques</li>
                                </ul>
                            </div>

                            <div className="service-card">
                                <h3>🔬 Skin Analysis</h3>
                                <p>Advanced skin analysis using professional tools</p>
                                <ul>
                                    <li>Digital skin scanner</li>
                                    <li>Detailed skin report</li>
                                    <li>Customized skincare plan</li>
                                    <li>Progress tracking</li>
                                </ul>
                            </div>

                            <div className="service-card">
                                <h3>👰 Bridal Consultation</h3>
                                <p>Special bridal beauty packages and consultations</p>
                                <ul>
                                    <li>Bridal makeup trial</li>
                                    <li>Pre-wedding skincare</li>
                                    <li>Product packages</li>
                                    <li>Timeline planning</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Book an Appointment</h2>
                        <p>
                            Want to ensure personalized attention? Book an appointment with our beauty experts
                            for a dedicated consultation session.
                        </p>
                        <div className="appointment-info">
                            <div className="appointment-option">
                                <h3>📞 Call to Book</h3>
                                <p>Call any store directly to schedule your appointment</p>
                            </div>
                            <div className="appointment-option">
                                <h3>💬 Online Chat</h3>
                                <p>Use our live chat to book appointments instantly</p>
                            </div>
                            <div className="appointment-option">
                                <h3>📱 Mobile App</h3>
                                <p>Book and manage appointments through our mobile app</p>
                            </div>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Store Policies</h2>
                        <div className="policies-list">
                            <div className="policy-item">
                                <h3>🛡️ Safety First</h3>
                                <p>All stores follow strict hygiene and safety protocols</p>
                            </div>
                            <div className="policy-item">
                                <h3>🎁 Try Before You Buy</h3>
                                <p>Test products before purchasing with our testers and samples</p>
                            </div>
                            <div className="policy-item">
                                <h3>↩️ Easy Returns</h3>
                                <p>Return or exchange products at any store location</p>
                            </div>
                            <div className="policy-item">
                                <h3>💳 Multiple Payment Options</h3>
                                <p>Cash, cards, UPI, and digital wallets accepted</p>
                            </div>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>Coming Soon</h2>
                        <p>We're expanding! New stores opening soon in:</p>
                        <div className="coming-soon-cities">
                            <span className="city-tag">Pune</span>
                            <span className="city-tag">Ahmedabad</span>
                            <span className="city-tag">Jaipur</span>
                            <span className="city-tag">Lucknow</span>
                            <span className="city-tag">Indore</span>
                            <span className="city-tag">Chandigarh</span>
                        </div>
                        <p>Stay tuned for updates on our new store openings!</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default StoresPage;