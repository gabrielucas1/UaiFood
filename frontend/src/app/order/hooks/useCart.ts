'use client';

import { useState } from 'react';

interface Category {
  id: string;
  description: string;
}

interface Item {
  id: string;
  description: string;
  unitPrice: string;
  category: Category;
}

interface CartItem {
  id: string;
  description: string;
  unitPrice: string;
  quantity: number;
  price: number;
  category: Category;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('PIX');

  const addToCart = (item: Item) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      
      if (existing) {
        return prev.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      
      return [...prev, {
        id: item.id,
        description: item.description,
        unitPrice: item.unitPrice,
        category: item.category,
        quantity: 1, 
        price: parseFloat(item.unitPrice)
      }];
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      setCart(prev => prev.filter(item => item.id !== itemId));
    } else {
      setCart(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const removeItem = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cart,
    paymentMethod,
    setPaymentMethod,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalPrice,
    getTotalItems
  };
}