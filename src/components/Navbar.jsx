import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ isOpen, closeMenu }) => {

    const links = [
        { name: 'NEW', path: '/new' },
        { name: 'BRANDS', path: '/brands' },
        {
            name: 'MAKEUP',
            path: '/makeup',
            hasMegaMenu: true,
            sections: [
                {
                    title: 'Face',
                    items: [
                        { name: 'View All Face', path: '/makeup/face' },
                        { name: 'Primer', path: '/makeup/primer' },
                        { name: 'Foundation', path: '/makeup/foundation' },
                        { name: 'Concealer', path: '/makeup/concealer' },
                        { name: 'BB & CC Cream', path: '/makeup/bb-cc-cream' },
                        { name: 'Face Powder', path: '/makeup/face-powder' },
                        { name: 'Blush', path: '/makeup/blush' },
                        { name: 'Bronzer', path: '/makeup/bronzer' },
                        { name: 'Highlighter', path: '/makeup/highlighter' },
                        { name: 'Contour Kit', path: '/makeup/contour-kit' }
                    ]
                },
                {
                    title: 'Eyes',
                    items: [
                        { name: 'View All Eyes', path: '/makeup/eyes' },
                        { name: 'Eyeshadow', path: '/makeup/eyeshadow' },
                        { name: 'Eyeliner', path: '/makeup/eyeliner' },
                        { name: 'Mascara', path: '/makeup/mascara' },
                        { name: 'Eyebrow', path: '/makeup/eyebrow' },
                        { name: 'False Lashes', path: '/makeup/false-lashes' },
                        { name: 'Eye Gel', path: '/makeup/eye-gel' }
                    ]
                },
                {
                    title: 'Lips',
                    items: [
                        { name: 'View All Lips', path: '/makeup/lips' },
                        { name: 'Lipstick', path: '/makeup/lipstick' },
                        { name: 'Lip Gloss', path: '/makeup/lip-gloss' },
                        { name: 'Lip Liner', path: '/makeup/lip-liner' },
                        { name: 'Lip Balm', path: '/makeup/lip-balm' },
                        { name: 'Lip Stain', path: '/makeup/lip-stain' },
                        { name: 'Lip Primer', path: '/makeup/lip-primer' }
                    ]
                }
            ]
        },
        { name: 'SKINCARE', path: '/skincare' },
        { name: 'HAIR', path: '/hair' },
        { name: 'TOOLS & BRUSHES', path: '/tools-brushes' },
        { name: 'BATH & BODY', path: '/bath-body' },
        { name: 'FRAGRANCE', path: '/fragrance' },
        { name: 'CLEAN', path: '/clean' },
        { name: 'GIFTS', path: '/gifts' },

    ];

    return (
        <nav className="navbar">
            <ul className={isOpen ? "nav-links active" : "nav-links"}>
                <li className="mobile-menu-header">
                    <span className="menu-title">Menu</span>
                    <button className="close-menu-btn" onClick={closeMenu}>
                        <FaTimes />
                    </button>
                </li>
                {links.map((link) => (
                    <li key={link.name} className={link.hasMegaMenu ? "has-mega-menu" : ""}>
                        <Link to={link.path} onClick={closeMenu}>
                            {link.name}
                        </Link>
                        {link.hasMegaMenu && (
                            <div className="mega-menu">
                                <div className="mega-menu-container">
                                    <div className="mega-menu-column main-link-col">
                                        <Link to={link.path} onClick={closeMenu} className="view-all-main">
                                            View All {link.name} <span className="arrow">›</span>
                                        </Link>
                                    </div>
                                    {link.sections.map((section, idx) => (
                                        <div key={idx} className="mega-menu-column">
                                            <h4 className="section-title">
                                                {section.title} <span className="arrow">›</span>
                                            </h4>
                                            <ul className="mega-menu-items">
                                                {section.items.map((item, itemIdx) => (
                                                    <li key={itemIdx}>
                                                        <Link to={item.path} onClick={closeMenu}>
                                                            {item.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navbar;
