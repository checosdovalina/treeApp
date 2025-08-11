import { useState, useEffect } from "react";

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
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    console.log('[useCart] Adding item:', newItem);
    console.log('[useCart] Current items before:', items);
    
    setItems(currentItems => {
      console.log('[useCart] Current items in setter:', currentItems);
      
      const existingItemIndex = currentItems.findIndex(
        item => 
          item.productId === newItem.productId && 
          item.size === newItem.size && 
          item.color === newItem.color &&
          item.gender === newItem.gender
      );

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity || 1;
        console.log('[useCart] Updated existing item. New items:', updatedItems);
        return updatedItems;
      } else {
        // Add new item
        const newItems = [...currentItems, { ...newItem, quantity: newItem.quantity || 1 }];
        console.log('[useCart] Added new item. New items:', newItems);
        return newItems;
      }
    });
  };

  const removeItem = (productId: number, size: string, color: string, gender?: string) => {
    setItems(currentItems => 
      currentItems.filter(
        item => !(item.productId === productId && item.size === size && item.color === color && item.gender === gender)
      )
    );
  };

  const updateQuantity = (productId: number, size: string, color: string, quantity: number, gender?: string) => {
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
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    const total = items.reduce((total, item) => total + item.quantity, 0);
    console.log('[useCart] getTotalItems called. Items:', items.length, 'Total:', total);
    return total;
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = (productId: number, size: string, color: string, gender?: string) => {
    const item = items.find(
      item => item.productId === productId && item.size === size && item.color === color && item.gender === gender
    );
    return item?.quantity || 0;
  };

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