import React from 'react';
import './InfoPage.css';

const InfoPage = ({ title, content }) => {
    return (
        <div className="info-page">
            <div className="info-container">
                <h1>{title}</h1>
                <div className="info-content">
                    {content ? content : <p>Content for {title} goes here.</p>}
                </div>
            </div>
        </div>
    );
};

export default InfoPage;
