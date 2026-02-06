import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        // Load from local storage on initial render
        const savedCart = localStorage.getItem('surya_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        // Save to local storage whenever cart changes
        localStorage.setItem('surya_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                // Check if adding one more exceeds stock
                if (existingItem.qty + 1 > product.stock) {
                    alert(`Only ${product.stock} items in stock!`);
                    return prevCart;
                }
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [...prevCart, { ...product, qty: 1 }];
        });
        alert("Item added to cart!");
    };

    const removeFromCart = (id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    const updateQty = (id, delta, stock) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item.id === id) {
                    const newQty = item.qty + delta;
                    if (newQty > stock) {
                        alert(`Stock limit reached! Only ${stock} available.`);
                        return item;
                    }
                    if (newQty < 1) return item;
                    return { ...item, qty: newQty };
                }
                return item;
            });
        });
    };

    const clearCart = () => {
        setCart([]);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => {
            const price = item.discount > 0
                ? Math.round(item.price * (1 - item.discount / 100))
                : item.price;
            return total + (price * item.qty);
        }, 0);
    };

    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.qty, 0);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, getCartTotal, getCartCount }}>
            {children}
        </CartContext.Provider>
    );
};
