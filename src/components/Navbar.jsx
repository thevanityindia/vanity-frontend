import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ isOpen, closeMenu }) => {

    const links = [

        {
            name: 'MAKEUP',
            path: '/makeup',
            hasMegaMenu: true,
            sections: [
                {
                    title: 'Face',
                    items: [
                        { name: 'Foundation', path: '/makeup/face/foundation' },
                        { name: 'BB / CC Cream', path: '/makeup/face/bb-cc-cream' },
                        { name: 'Primer', path: '/makeup/face/primer' },
                        { name: 'Concealer', path: '/makeup/face/concealer' },
                        { name: 'Compact / Loose Powder', path: '/makeup/face/powder' },
                        { name: 'Blush', path: '/makeup/face/blush' },
                        { name: 'Highlighter', path: '/makeup/face/highlighter' },
                        { name: 'Bronzer', path: '/makeup/face/bronzer' },
                        { name: 'Setting Spray / Fixer', path: '/makeup/face/setting-spray' }
                    ]
                },
                {
                    title: 'Eyes',
                    items: [
                        { name: 'Kajal', path: '/makeup/eyes/kajal' },
                        { name: 'Eyeliner', path: '/makeup/eyes/eyeliner' },
                        { name: 'Mascara', path: '/makeup/eyes/mascara' },
                        { name: 'Eye Shadow', path: '/makeup/eyes/eye-shadow' },
                        { name: 'Eyebrow Pencil / Gel / Powder', path: '/makeup/eyes/eyebrow' },
                        { name: 'False Eyelashes', path: '/makeup/eyes/false-eyelashes' },
                        { name: 'Lash Glue', path: '/makeup/eyes/lash-glue' },
                        { name: 'Eye Primer', path: '/makeup/eyes/eye-primer' }
                    ]
                },
                {
                    title: 'Lips',
                    items: [
                        { name: 'Lipstick', path: '/makeup/lips/lipstick' },
                        { name: 'Lip Gloss', path: '/makeup/lips/lip-gloss' },
                        { name: 'Lip Liner', path: '/makeup/lips/lip-liner' },
                        { name: 'Lip Tint', path: '/makeup/lips/lip-tint' },
                        { name: 'Lip Balm', path: '/makeup/lips/lip-balm' },
                        { name: 'Lip Scrub', path: '/makeup/lips/lip-scrub' }
                    ]
                },
                {
                    title: 'Nails',
                    items: [
                        { name: 'Nail Polish', path: '/makeup/nails/nail-polish' },
                        { name: 'Gel Nail Paint', path: '/makeup/nails/gel-nail-paint' },
                        { name: 'Nail Art Kits', path: '/makeup/nails/nail-art-kits' },
                        { name: 'Nail Remover', path: '/makeup/nails/nail-remover' },
                        { name: 'Nail Extensions', path: '/makeup/nails/nail-extensions' },
                        { name: 'Nail Stickers', path: '/makeup/nails/nail-stickers' },
                        { name: 'Nail Tools', path: '/makeup/nails/nail-tools' }
                    ]
                },
                {
                    title: 'Mom & Baby Care',
                    items: [
                        { name: 'Baby Lotions', path: '/makeup/mom-baby/lotions' },
                        { name: 'Baby Shampoo', path: '/makeup/mom-baby/shampoo' },
                        { name: 'Baby Oil', path: '/makeup/mom-baby/oil' },
                        { name: 'Diapers', path: '/makeup/mom-baby/diapers' },
                        { name: 'Baby Wipes', path: '/makeup/mom-baby/wipes' },
                        { name: 'Maternity Care', path: '/makeup/mom-baby/maternity' }
                    ]
                },
                {
                    title: 'Wellness',
                    items: [
                        { name: 'Vitamins & Supplements', path: '/makeup/wellness/vitamins' },
                        { name: 'Feminine Wellness', path: '/makeup/wellness/feminine' },
                        { name: 'Stress Relief', path: '/makeup/wellness/stress-relief' },
                        { name: 'Sleep Aids (Herbal)', path: '/makeup/wellness/sleep-aids' }
                    ]
                },
                {
                    title: 'Gifts & Combos',
                    items: [
                        { name: 'Bridal Makeup Kits', path: '/makeup/gifts/bridal-kits' },
                        { name: 'Festive Gift Hampers', path: '/makeup/gifts/festive-hampers' },
                        { name: 'Skincare Combos', path: '/makeup/gifts/skincare-combos' },
                        { name: 'Travel Kits', path: '/makeup/gifts/travel-kits' },
                        { name: 'Mini Packs', path: '/makeup/gifts/mini-packs' }
                    ]
                },
                {
                    title: 'Seasonal',
                    items: [
                        { name: 'Bridal Essentials', path: '/makeup/seasonal/bridal' },
                        { name: 'Party Kits', path: '/makeup/seasonal/party' },
                        { name: 'Travel-Size', path: '/makeup/seasonal/travel-size' },
                        { name: 'Monsoon/Summer/Winter', path: '/makeup/seasonal/seasonal-care' }
                    ]
                },
                {
                    title: 'Utility',
                    items: [
                        { name: 'Cotton Pads', path: '/makeup/utility/cotton-pads' },
                        { name: 'Cotton Buds', path: '/makeup/utility/cotton-buds' },
                        { name: 'Razors', path: '/makeup/utility/razors' },
                        { name: 'Hair Removal Cream', path: '/makeup/utility/hair-removal-cream' },
                        { name: 'Wax Strips', path: '/makeup/utility/wax-strips' },
                        { name: 'Face Razors', path: '/makeup/utility/face-razors' },
                        { name: 'Storage Boxes', path: '/makeup/utility/storage-boxes' }
                    ]
                }
            ]
        },
        {
            name: 'SKINCARE',
            path: '/skincare',
            hasMegaMenu: true,
            sections: [
                {
                    title: 'Cleansing',
                    items: [
                        { name: 'Face Wash', path: '/skincare/cleansing/face-wash' },
                        { name: 'Cleanser', path: '/skincare/cleansing/cleanser' },
                        { name: 'Micellar Water', path: '/skincare/cleansing/micellar-water' },
                        { name: 'Makeup Remover Wipes', path: '/skincare/cleansing/makeup-remover-wipes' }
                    ]
                },
                {
                    title: 'Treatment & Care',
                    items: [
                        { name: 'Toner', path: '/skincare/treatment/toner' },
                        { name: 'Serum', path: '/skincare/treatment/serum' },
                        { name: 'Moisturizer', path: '/skincare/treatment/moisturizer' },
                        { name: 'Face Oil', path: '/skincare/treatment/face-oil' },
                        { name: 'Sunscreen', path: '/skincare/treatment/sunscreen' },
                        { name: 'Night Cream', path: '/skincare/treatment/night-cream' },
                        { name: 'Eye Cream', path: '/skincare/treatment/eye-cream' }
                    ]
                },
                {
                    title: 'Masks & Packs',
                    items: [
                        { name: 'Sheet Masks', path: '/skincare/masks/sheet-masks' },
                        { name: 'Clay Masks', path: '/skincare/masks/clay-masks' },
                        { name: 'Peel-Off Masks', path: '/skincare/masks/peel-off-masks' },
                        { name: 'Face Packs', path: '/skincare/masks/face-packs' }
                    ]
                },
                {
                    title: 'Body Care',
                    items: [
                        { name: 'Body Wash', path: '/skincare/body/body-wash' },
                        { name: 'Soap', path: '/skincare/body/soap' },
                        { name: 'Body Scrub', path: '/skincare/body/body-scrub' },
                        { name: 'Body Lotion', path: '/skincare/body/body-lotion' },
                        { name: 'Body Butter', path: '/skincare/body/body-butter' },
                        { name: 'Hand Cream', path: '/skincare/body/hand-cream' },
                        { name: 'Foot Cream', path: '/skincare/body/foot-cream' }
                    ]
                }
            ]
        },
        {
            name: 'HAIR CARE',
            path: '/hair-care',
            hasMegaMenu: true,
            sections: [
                {
                    title: 'Hair Care',
                    items: [
                        { name: 'Shampoo', path: '/hair-care/shampoo' },
                        { name: 'Conditioner', path: '/hair-care/conditioner' },
                        { name: 'Hair Mask', path: '/hair-care/hair-mask' },
                        { name: 'Hair Serum', path: '/hair-care/hair-serum' },
                        { name: 'Hair Oil', path: '/hair-care/hair-oil' },
                        { name: 'Hair Spa Products', path: '/hair-care/hair-spa' },
                        { name: 'Dry Shampoo', path: '/hair-care/dry-shampoo' }
                    ]
                },
                {
                    title: 'Styling',
                    items: [
                        { name: 'Hair Gel', path: '/hair-care/styling/hair-gel' },
                        { name: 'Hair Wax', path: '/hair-care/styling/hair-wax' },
                        { name: 'Hair Mousse', path: '/hair-care/styling/hair-mousse' },
                        { name: 'Hair Spray', path: '/hair-care/styling/hair-spray' }
                    ]
                },
                {
                    title: 'Hair Tools',
                    items: [
                        { name: 'Hair Dryer', path: '/hair-care/tools/hair-dryer' },
                        { name: 'Straightener', path: '/hair-care/tools/straightener' },
                        { name: 'Curler', path: '/hair-care/tools/curler' },
                        { name: 'Crimper', path: '/hair-care/tools/crimper' }
                    ]
                }
            ]
        },
        {
            name: 'PERSONAL HYGIENE',
            path: '/personal-hygiene',
            hasMegaMenu: true,
            sections: [
                {
                    title: 'Intimate Care',
                    items: [
                        { name: 'Sanitary Pads', path: '/personal-hygiene/sanitary-pads' },
                        { name: 'Panty Liners', path: '/personal-hygiene/panty-liners' },
                        { name: 'Menstrual Cups', path: '/personal-hygiene/menstrual-cups' },
                        { name: 'Intimate Wash', path: '/personal-hygiene/intimate-wash' }
                    ]
                },
                {
                    title: 'Body & Hygiene',
                    items: [
                        { name: 'Wet Wipes', path: '/personal-hygiene/wet-wipes' },
                        { name: 'Tissues', path: '/personal-hygiene/tissues' },
                        { name: 'Deodorants', path: '/personal-hygiene/deodorants' },
                        { name: 'Roll-Ons', path: '/personal-hygiene/roll-ons' },
                        { name: 'Perfumes', path: '/personal-hygiene/perfumes' }
                    ]
                }
            ]
        },
        {
            name: 'BATH & SPA',
            path: '/bath-spa',
            hasMegaMenu: true,
            sections: [
                {
                    title: 'Essentials',
                    items: [
                        { name: 'Bath Salts', path: '/bath-spa/bath-salts' },
                        { name: 'Bath Bombs', path: '/bath-spa/bath-bombs' },
                        { name: 'Essential Oils', path: '/bath-spa/essential-oils' },
                        { name: 'Aroma Candles', path: '/bath-spa/aroma-candles' },
                        { name: 'Massage Oils', path: '/bath-spa/massage-oils' },
                        { name: 'Loofahs', path: '/bath-spa/loofahs' },
                        { name: 'Body Brushes', path: '/bath-spa/body-brushes' }
                    ]
                }
            ]
        },
        {
            name: 'TOOLS & ACCESSORIES',
            path: '/tools-accessories',
            hasMegaMenu: true,
            sections: [
                {
                    title: 'Makeup Tools',
                    items: [
                        { name: 'Makeup Brushes', path: '/tools-accessories/makeup-brushes' },
                        { name: 'Beauty Blenders', path: '/tools-accessories/beauty-blenders' },
                        { name: 'Facial Rollers', path: '/tools-accessories/facial-rollers' },
                        { name: 'Gua Sha', path: '/tools-accessories/gua-sha' },
                        { name: 'Tweezers', path: '/tools-accessories/tweezers' },
                        { name: 'Eyelash Curlers', path: '/tools-accessories/eyelash-curlers' },
                        { name: 'Mirrors', path: '/tools-accessories/mirrors' },
                        { name: 'Makeup Organizers', path: '/tools-accessories/makeup-organizers' }
                    ]
                }
            ]
        },
        {
            name: 'FASHION',
            path: '/fashion-accessories',
            hasMegaMenu: true,
            sections: [
                {
                    title: 'Jewelry',
                    items: [
                        { name: 'Earrings', path: '/fashion/jewelry/earrings' },
                        { name: 'Necklaces', path: '/fashion/jewelry/necklaces' },
                        { name: 'Rings', path: '/fashion/jewelry/rings' },
                        { name: 'Bangles', path: '/fashion/jewelry/bangles' },
                        { name: 'Anklets', path: '/fashion/jewelry/anklets' },
                        { name: 'Nose Pins', path: '/fashion/jewelry/nose-pins' }
                    ]
                },
                {
                    title: 'Hair Accessories',
                    items: [
                        { name: 'Hair Bands', path: '/fashion/hair/hair-bands' },
                        { name: 'Scrunchies', path: '/fashion/hair/scrunchies' },
                        { name: 'Hair Clips', path: '/fashion/hair/hair-clips' },
                        { name: 'Hair Pins', path: '/fashion/hair/hair-pins' },
                        { name: 'Headbands', path: '/fashion/hair/headbands' }
                    ]
                },
                {
                    title: 'Others',
                    items: [
                        { name: 'Handbags', path: '/fashion/others/handbags' },
                        { name: 'Clutches', path: '/fashion/others/clutches' },
                        { name: 'Wallets', path: '/fashion/others/wallets' },
                        { name: 'Sunglasses', path: '/fashion/others/sunglasses' },
                        { name: 'Watches', path: '/fashion/others/watches' }
                    ]
                }
            ]
        },
        {
            name: 'CLOTHING',
            path: '/clothing',
            hasMegaMenu: true,
            sections: [
                {
                    title: 'Innerwear',
                    items: [
                        { name: 'Bras', path: '/clothing/innerwear/bras' },
                        { name: 'Panties', path: '/clothing/innerwear/panties' },
                        { name: 'Shapewear', path: '/clothing/innerwear/shapewear' },
                        { name: 'Camisoles', path: '/clothing/innerwear/camisoles' }
                    ]
                },
                {
                    title: 'Clothing',
                    items: [
                        { name: 'Nightwear', path: '/clothing/nightwear' },
                        { name: 'Loungewear', path: '/clothing/loungewear' },
                        { name: 'Leggings', path: '/clothing/leggings' },
                        { name: 'Dupattas', path: '/clothing/dupattas' },
                        { name: 'Socks', path: '/clothing/socks' }
                    ]
                }
            ]
        },
        {
            name: 'FOOTWEAR',
            path: '/footwear',
            hasMegaMenu: true,
            sections: [
                {
                    title: 'Styles',
                    items: [
                        { name: 'Flats', path: '/footwear/flats' },
                        { name: 'Sandals', path: '/footwear/sandals' },
                        { name: 'Heels', path: '/footwear/heels' },
                        { name: 'Slippers', path: '/footwear/slippers' },
                        { name: 'Flip-Flops', path: '/footwear/flip-flops' },
                        { name: 'Foot Cushions', path: '/footwear/foot-cushions' }
                    ]
                }
            ]
        },
        {
            name: 'HERBAL & ORGANIC',
            path: '/herbal-organic',
            hasMegaMenu: true,
            sections: [
                {
                    title: 'Natural',
                    items: [
                        { name: 'Herbal Skincare', path: '/herbal/skincare' },
                        { name: 'Ayurvedic Hair Oils', path: '/herbal/hair-oils' },
                        { name: 'Natural Soaps', path: '/herbal/soaps' },
                        { name: 'Organic Face Packs', path: '/herbal/face-packs' },
                        { name: 'Chemical-Free Makeup', path: '/herbal/makeup' }
                    ]
                }
            ]
        }
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
