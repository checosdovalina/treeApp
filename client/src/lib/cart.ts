import { useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
}

const CART_STORAGE_KEY = 'uniformes-laguna-cart';

// Get cart from localStorage
const getStoredCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save cart to localStorage
const saveCart = (items: CartItem[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Handle localStorage errors silently
  }
};

// Global cart state
let cartItems: CartItem[] = getStoredCart();
let listeners: Array<() => void> = [];

// Notify all listeners
const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

// Add item to cart
export const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }): void => {
  const newItem: CartItem = {
    ...item,
    quantity: item.quantity || 1,
  };

  // Create unique ID based on product, size, and color
  const uniqueId = `${item.id}-${item.size || ''}-${item.color || ''}`;
  newItem.id = uniqueId;

  const existingIndex = cartItems.findIndex(cartItem => cartItem.id === uniqueId);
  
  if (existingIndex >= 0) {
    cartItems[existingIndex].quantity += newItem.quantity;
  } else {
    cartItems.push(newItem);
  }
  
  saveCart(cartItems);
  notifyListeners();
};

// Remove item from cart
export const removeFromCart = (id: string): void => {
  cartItems = cartItems.filter(item => item.id !== id);
  saveCart(cartItems);
  notifyListeners();
};

// Update item quantity
export const updateCartItemQuantity = (id: string, quantity: number): void => {
  if (quantity <= 0) {
    removeFromCart(id);
    return;
  }

  const itemIndex = cartItems.findIndex(item => item.id === id);
  if (itemIndex >= 0) {
    cartItems[itemIndex].quantity = quantity;
    saveCart(cartItems);
    notifyListeners();
  }
};

// Clear entire cart
export const clearCart = (): void => {
  cartItems = [];
  saveCart(cartItems);
  notifyListeners();
};

// Get cart totals
export const getCartTotals = () => {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  return {
    subtotal,
    itemCount,
    items: cartItems,
  };
};

// React hook for cart state
export const useCart = () => {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const listener = () => forceUpdate({});
    listeners.push(listener);
    
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  const { subtotal, itemCount, items } = getCartTotals();

  return {
    items,
    total: subtotal,
    itemCount,
    addItem: addToCart,
    removeItem: removeFromCart,
    updateQuantity: updateCartItemQuantity,
    clearCart,
  };
};
