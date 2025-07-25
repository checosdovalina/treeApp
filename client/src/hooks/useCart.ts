import { useState, useEffect } from "react";

export interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
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
    setItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(
        item => 
          item.productId === newItem.productId && 
          item.size === newItem.size && 
          item.color === newItem.color
      );

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity || 1;
        return updatedItems;
      } else {
        // Add new item
        return [...currentItems, { ...newItem, quantity: newItem.quantity || 1 }];
      }
    });
  };

  const removeItem = (productId: number, size: string, color: string) => {
    setItems(currentItems => 
      currentItems.filter(
        item => !(item.productId === productId && item.size === size && item.color === color)
      )
    );
  };

  const updateQuantity = (productId: number, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, size, color);
      return;
    }

    setItems(currentItems => 
      currentItems.map(item => 
        item.productId === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = (productId: number, size: string, color: string) => {
    const item = items.find(
      item => item.productId === productId && item.size === size && item.color === color
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