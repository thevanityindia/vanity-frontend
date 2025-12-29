import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ShopContext = createContext();

export const useShop = () => {
    return useContext(ShopContext);
};

export const ShopProvider = ({ children }) => {
    const { user, loading } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);

    // Load data when user changes or loading finishes
    useEffect(() => {
        if (loading) return;

        const userId = user ? (user.email || 'user') : 'guest';

        try {
            const storedCart = localStorage.getItem(`cart_${userId}`);
            setCartItems(storedCart ? JSON.parse(storedCart) : []);

            const storedWishlist = localStorage.getItem(`wishlist_${userId}`);
            setWishlistItems(storedWishlist ? JSON.parse(storedWishlist) : []);
        } catch (error) {
            console.error("Error loading shop data:", error);
            setCartItems([]);
            setWishlistItems([]);
        }
    }, [user, loading]);

    // Save data whenever it changes
    useEffect(() => {
        if (loading) return;

        const userId = user ? (user.email || 'user') : 'guest';

        localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
        localStorage.setItem(`wishlist_${userId}`, JSON.stringify(wishlistItems));
    }, [cartItems, wishlistItems, user, loading]);

    const addToBag = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevItems, { ...product, quantity }];
        });
    };

    const removeFromBag = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, delta) => {
        setCartItems(prevItems => prevItems.map(item => {
            if (item.id === productId) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        }));
    };

    const addToWishlist = (product) => {
        setWishlistItems(prevItems => {
            if (prevItems.find(item => item.id === product.id)) return prevItems;
            return [...prevItems, product];
        });
    };

    const removeFromWishlist = (productId) => {
        setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item.id === productId);
    };

    const value = {
        cartItems,
        wishlistItems,
        addToBag,
        removeFromBag,
        updateQuantity,
        addToWishlist,
        removeFromWishlist,
        isInWishlist
    };

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    );
};
