import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ isOpen, closeMenu }) => {

    const links = [
        { name: 'New', path: '/new' },
        { name: 'Brands', path: '/brands' },
        { name: 'Makeup', path: '/makeup' },
        { name: 'Skincare', path: '/skincare' },
        { name: 'Hair', path: '/hair' },
        { name: 'Fragrance', path: '/fragrance' },
        { name: 'Bath & Body', path: '/bath-body' },
        { name: 'Artificial Jewellery', path: '/artificial-jewellery' }
    ];

    return (
        <nav className="navbar">
            <ul className={isOpen ? "nav-links active" : "nav-links"}>
                {links.map((link) => (
                    <li key={link.name}>
                        <Link to={link.path} onClick={closeMenu}>{link.name}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navbar;
