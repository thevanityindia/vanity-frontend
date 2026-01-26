import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';
import API_BASE_URL from '../config';

const ShopContext = createContext();

export const useShop = () => {
    return useContext(ShopContext);
};

export const ShopProvider = ({ children }) => {
    const { user, isAuthenticated, loading } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [shopLoading, setShopLoading] = useState(false);

    const fetchShopData = async () => {
        if (isAuthenticated) {
            setShopLoading(true);
            try {
                const token = localStorage.getItem('token');
                const headers = { 'Authorization': `Bearer ${token}` };

                // Fetch Cart
                const cartRes = await fetch(`${API_BASE_URL}/api/cart`, { headers });
                const cartData = await cartRes.json();
                if (cartData.success) {
                    const mappedCart = cartData.data.items.map(item => ({
                        ...item.productId,
                        quantity: item.quantity,
                        cartItemId: item._id
                    }));
                    setCartItems(mappedCart);
                } else {
                    setCartItems([]);
                }

                // Fetch Wishlist
                const wishlistRes = await fetch(`${API_BASE_URL}/api/wishlist`, { headers });
                const wishlistData = await wishlistRes.json();
                if (wishlistData.success) {
                    const mappedWishlist = wishlistData.data.items.map(item => item.productId);
                    setWishlistItems(mappedWishlist);
                }
            } catch (error) {
                console.error("Error fetching shop data:", error);
            } finally {
                setShopLoading(false);
            }
        } else {
            // Guest: Load from Local Storage
            try {
                const storedCart = localStorage.getItem('guest_cart');
                setCartItems(storedCart ? JSON.parse(storedCart) : []);

                const storedWishlist = localStorage.getItem('guest_wishlist');
                setWishlistItems(storedWishlist ? JSON.parse(storedWishlist) : []);
            } catch (error) {
                console.error("Error loading local storage:", error);
            }
        }
    };

    useEffect(() => {
        if (!loading) {
            fetchShopData();
        }
    }, [isAuthenticated, loading]);

    // Save to Local Storage for guests
    useEffect(() => {
        if (loading || isAuthenticated) return;
        localStorage.setItem('guest_cart', JSON.stringify(cartItems));
        localStorage.setItem('guest_wishlist', JSON.stringify(wishlistItems));
    }, [cartItems, wishlistItems, isAuthenticated, loading]);

    const addToBag = async (product, quantity = 1) => {
        if (isAuthenticated) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/api/cart`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ productId: product.id || product._id, quantity })
                });
                const data = await response.json();

                if (data.success) {
                    // Refresh cart/update state
                    const mappedCart = data.data.items.map(item => ({
                        ...item.productId,
                        quantity: item.quantity,
                        cartItemId: item._id
                    }));
                    setCartItems(mappedCart);
                    // toast.success("Added to bag"); // toast is usually handled in component, avoiding duplicate
                } else {
                    toast.error(data.error || "Failed to add to bag");
                }
            } catch (error) {
                console.error(error);
                toast.error("Network error");
            }
        } else {
            // Guest Logic
            setCartItems(prevItems => {
                const existingItem = prevItems.find(item => (item.id || item._id) === (product.id || product._id));
                if (existingItem) {
                    return prevItems.map(item =>
                        (item.id || item._id) === (product.id || product._id)
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                }
                return [...prevItems, { ...product, quantity }];
            });
            // toast.success("Added to bag locally");
        }
    };

    const removeFromBag = async (productId) => {
        if (isAuthenticated) {
            // Find the cart item ID
            const item = cartItems.find(i => (i.id || i._id) === productId);
            if (!item || !item.cartItemId) return;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/api/cart/${item.cartItemId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();

                if (data.success) {
                    const mappedCart = data.data.items.map(item => ({
                        ...item.productId,
                        quantity: item.quantity,
                        cartItemId: item._id
                    }));
                    setCartItems(mappedCart);
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            setCartItems(prevItems => prevItems.filter(item => (item.id || item._id) !== productId));
        }
    };

    const updateQuantity = async (productId, delta) => {
        if (isAuthenticated) {
            const item = cartItems.find(i => (i.id || i._id) === productId);
            if (!item || !item.cartItemId) return;

            const newQuantity = Math.max(1, item.quantity + delta);

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/api/cart/${item.cartItemId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ quantity: newQuantity })
                });
                const data = await response.json();

                if (data.success) {
                    const mappedCart = data.data.items.map(item => ({
                        ...item.productId,
                        quantity: item.quantity,
                        cartItemId: item._id
                    }));
                    setCartItems(mappedCart);
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            setCartItems(prevItems => prevItems.map(item => {
                if ((item.id || item._id) === productId) {
                    return { ...item, quantity: Math.max(1, item.quantity + delta) };
                }
                return item;
            }));
        }
    };

    const addToWishlist = async (product) => {
        if (isAuthenticated) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ productId: product.id || product._id })
                });
                const data = await response.json();

                if (data.success) {
                    const mappedWishlist = data.data.items.map(item => item.productId);
                    setWishlistItems(mappedWishlist);
                } else {
                    toast.error(data.error);
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            setWishlistItems(prevItems => {
                if (prevItems.find(item => (item.id || item._id) === (product.id || product._id))) return prevItems;
                return [...prevItems, product];
            });
        }
    };

    const removeFromWishlist = async (productId) => {
        if (isAuthenticated) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/api/wishlist/${productId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();

                if (data.success) {
                    const mappedWishlist = data.data.items.map(item => item.productId);
                    setWishlistItems(mappedWishlist);
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            setWishlistItems(prevItems => prevItems.filter(item => (item.id || item._id) !== productId));
        }
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => (item.id || item._id) === productId);
    };

    const clearCart = async () => {
        if (isAuthenticated) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/api/cart`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    setCartItems([]);
                }
            } catch (error) {
                console.error("Error clearing cart:", error);
            }
        } else {
            setCartItems([]);
            localStorage.removeItem('guest_cart');
        }
    };

    const value = {
        cartItems,
        wishlistItems,
        addToBag,
        removeFromBag,
        updateQuantity,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        shopLoading,
        fetchShopData,
        clearCart
    };

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    );
};
