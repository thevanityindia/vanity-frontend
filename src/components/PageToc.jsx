import React, { useState, useEffect } from 'react';
import { FaList, FaTimes } from 'react-icons/fa';

const PageToc = ({ sections }) => {
    const [isOpen, setOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100;
            const sections = document.querySelectorAll('[data-toc-id]');

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    setActiveSection(section.getAttribute('data-toc-id'));
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.querySelector(`[data-toc-id="${id}"]`);
        if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth'
            });
            setOpen(false);
        }
    };

    if (!sections || sections.length === 0) {
        return null;
    }

    return (
        <>
            <button
                className="toc-trigger"
                onClick={() => setOpen(true)}
                aria-label="Show table of contents"
                title="Show table of contents"
            >
                <FaList />
            </button>

            {isOpen && (
                <div className="toc-modal visible" onClick={(e) => {
                    if (e.target === e.currentTarget) setOpen(false);
                }}>
                    <div className="toc-modal-content">
                        <button
                            className="toc-close"
                            onClick={() => setOpen(false)}
                            aria-label="Close table of contents"
                        >
                            <FaTimes />
                        </button>

                        <div className="toc-title">
                            <FaList /> Quick Navigation
                        </div>

                        <ul className="toc-list">
                            {sections.map((section) => (
                                <li key={section.id} className="toc-item">
                                    <a
                                        className={`toc-link ${activeSection === section.id ? 'active' : ''}`}
                                        onClick={() => scrollToSection(section.id)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                scrollToSection(section.id);
                                            }
                                        }}
                                    >
                                        {section.title}
                                    </a>

                                    {section.subsections && section.subsections.length > 0 && (
                                        <ul className="toc-sub-list">
                                            {section.subsections.map((sub) => (
                                                <li key={sub.id} className="toc-sub-item">
                                                    <a
                                                        className={`toc-link ${activeSection === sub.id ? 'active' : ''}`}
                                                        onClick={() => scrollToSection(sub.id)}
                                                        role="button"
                                                        tabIndex={0}
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter' || e.key === ' ') {
                                                                e.preventDefault();
                                                                scrollToSection(sub.id);
                                                            }
                                                        }}
                                                    >
                                                        {sub.title}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
};

export default PageToc;