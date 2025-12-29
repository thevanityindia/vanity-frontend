import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import hero1 from '../assets/banners/hero1.png';
import promo1 from '../assets/banners/promo1.png';
import promo2 from '../assets/banners/promo2.png';
import './Hero.css';

const slides = [
    {
        id: 1,
        image: hero1,
        title: "Lumière Collection",
        subtitle: "Experience the glow of luxury.",
        link: "/makeup"
    },
    {
        id: 2,
        image: promo1,
        title: "Skincare Essentials",
        subtitle: "Pure ingredients for radiant skin.",
        link: "/skincare"
    },
    {
        id: 3,
        image: promo2,
        title: "The Bestsellers",
        subtitle: "Shop the viral favorites now.",
        link: "/new"
    }
];

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    // Auto-advance slider - DISABLED TEMPORARILY due to blanking issue
    /*
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);
    */

    return (
        <section className="hero">
            <div className="hero-slider">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                        style={{
                            backgroundImage: slide.image ? `url(${slide.image})` : 'none',
                            backgroundColor: slide.image ? 'transparent' : '#333' // Fallback color
                        }}
                    >
                        <div className="hero-overlay"></div>
                        <div className="hero-content">
                            <h1>{slide.title}</h1>
                            <p>{slide.subtitle}</p>
                            <button className="shop-btn" onClick={() => navigate(slide.link)}>
                                Shop Now
                            </button>
                        </div>
                    </div>
                ))}

                <div className="hero-dots">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className={`dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
