import React from 'react';
import './InfoPage.css'; // Reusing InfoPage styles for consistency

const StoresEvents = () => {
    return (
        <div className="info-page">
            <div className="info-container">
                <h1>Stores & Events</h1>
                <div className="info-content">
                    <p>Find your nearest The Vanity store and check out upcoming beauty events!</p>
                    {/* Placeholder for store locator functionality */}
                    <div style={{ padding: '2rem', background: '#f9f9f9', textAlign: 'center' }}>
                        <p>Store Locator Map Coming Soon...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoresEvents;
