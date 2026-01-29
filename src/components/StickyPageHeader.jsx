import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const StickyPageHeader = ({ title, showProgress = true }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercentage = (scrollTop / docHeight) * 100;

            setProgress(Math.min(scrollPercentage, 100));

            if (scrollTop > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className={`sticky-page-header visible`}>
            {showProgress && (
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }} />
                </div>
            )}
            <div className="sticky-header-content">
                <div className="sticky-header-title">
                    {title}
                </div>
                <button
                    className="back-to-top"
                    onClick={scrollToTop}
                    aria-label="Back to top"
                    title="Back to top"
                >
                    <FaArrowUp /> Top
                </button>
            </div>
        </div>
    );
};

export default StickyPageHeader;