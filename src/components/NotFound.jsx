import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '70vh',
            textAlign: 'center',
            padding: '2rem'
        }}>
            <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
            <h2 style={{ marginBottom: '2rem' }}>Page Not Found</h2>
            <p style={{ marginBottom: '2rem', color: '#666' }}>
                The page you are looking for does not exist or has been moved.
            </p>
            <Link to="/" style={{
                padding: '10px 20px',
                backgroundColor: '#000',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '4px'
            }}>
                Back to Home
            </Link>
        </div>
    );
};

export default NotFound;
