import React from 'react';
import Hero from './Hero';
import ProductSlider from './ProductSlider';

import offerMid1 from '../assets/banners/offer_mid_1.png';
import offerMid2 from '../assets/banners/offer_mid_2.png';

const Home = ({ products }) => {
    return (
        <>
            <Hero />

            <ProductSlider title="Trending Now" products={products.slice(0, 10)} />

            {/* Offer Banner 1 */}
            <div className="offer-banner-container" style={{ width: '100%', margin: '20px 0', display: 'flex', justifyContent: 'center' }}>
                <img
                    src={offerMid1}
                    alt="Flash Sale"
                    style={{ maxWidth: '1200px', width: '95%', height: '300px', objectFit: 'cover', borderRadius: '8px', display: 'block' }}
                />
            </div>

            <ProductSlider title="New Arrivals" products={products.slice(10, 20)} />

            {/* Offer Banner 2 */}
            <div className="offer-banner-container" style={{ width: '100%', margin: '20px 0', display: 'flex', justifyContent: 'center' }}>
                <img
                    src={offerMid2}
                    alt="Free Gift Offer"
                    style={{ maxWidth: '1200px', width: '95%', height: '300px', objectFit: 'cover', borderRadius: '8px', display: 'block' }}
                />
            </div>


        </>
    );
};

export default Home;
