import { useState, useEffect, useCallback } from "react";

export interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  gender?: string; // Para productos mixtos
  image?: string;
  sku?: string;
}

const STORAGE_KEY = "shopping-cart";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    const itemToAdd = { ...newItem, quantity: newItem.quantity || 1 };
    
    setItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(
        item => 
          item.productId === itemToAdd.productId && 
          item.size === itemToAdd.size && 
          item.color === itemToAdd.color &&
          item.gender === itemToAdd.gender
      );

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += itemToAdd.quantity;
        return updatedItems;
      } else {
        // Add new item
        return [...currentItems, itemToAdd];
      }
    });
  }, []);

  const removeItem = useCallback((productId: number, size: string, color: string, gender?: string) => {
    setItems(currentItems => 
      currentItems.filter(
        item => !(item.productId === productId && item.size === size && item.color === color && item.gender === gender)
      )
    );
  }, []);

  const updateQuantity = useCallback((productId: number, size: string, color: string, quantity: number, gender?: string) => {
    if (quantity <= 0) {
      removeItem(productId, size, color, gender);
      return;
    }

    setItems(currentItems => 
      currentItems.map(item => 
        item.productId === productId && item.size === size && item.color === color && item.gender === gender
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [items]);

  const getItemCount = useCallback((productId: number, size: string, color: string, gender?: string) => {
    const item = items.find(
      item => item.productId === productId && item.size === size && item.color === color && item.gender === gender
    );
    return item?.quantity || 0;
  }, [items]);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getItemCount,
  };
}