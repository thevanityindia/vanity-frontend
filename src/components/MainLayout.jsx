import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatAssistant from './ChatAssistant';

const MainLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <div className="sticky-header-container">
                <Header toggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} isMenuOpen={isMobileMenuOpen} />
                <Navbar isOpen={isMobileMenuOpen} closeMenu={() => setIsMobileMenuOpen(false)} />
            </div>
            <Outlet />
            <Footer />
            <ChatAssistant />
        </>
    );
};

export default MainLayout;
