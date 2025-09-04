'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { addToCart as apiAddToCart, updateCartItem as apiUpdateCartItem, removeFromCart as apiRemoveFromCart, fetchCartItems } from '@/lib/api';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  stock: number;
  productId?: string;
  category?: string;
}

interface CartContextType {
  cart: CartItem[];
  cartTotal: number;
  addToCart: (product: any, quantity: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => void;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  useEffect(() => {
    if (token) {
      loadCart();
    }
  }, [token]);

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setCartTotal(total);
  }, [cart]);

  const loadCart = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const cartItems = await fetchCartItems(token);
      setCart(cartItems.map(item => ({
        ...item,
        stock: item.quantity || 10 // Set default stock if missing
      })));
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: any, quantity: number) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    const newItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image,
      stock: product.quantity || 10
    };

    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    let updatedCart;

    if (existingItemIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + quantity
      };
    } else {
      updatedCart = [...cart, newItem];
    }

    setCart(updatedCart);

    try {
      await apiAddToCart(token, product.id, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setCart(cart);
      throw error;
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    const originalCart = [...cart];
    const updatedCart = cart.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    ).filter(item => item.quantity > 0);
    
    setCart(updatedCart);

    try {
      await apiUpdateCartItem(token, itemId, quantity);
    } catch (error) {
      console.error('Error updating cart item:', error);
      setCart(originalCart);
      throw error;
    }
  };

  const removeFromCart = async (itemId: string) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    const originalCart = [...cart];
    const updatedCart = cart.filter(item => item.id !== itemId);
    
    setCart(updatedCart);

    try {
      await apiRemoveFromCart(token, itemId);
    } catch (error) {
      console.error('Error removing from cart:', error);
      setCart(originalCart);
      throw error;
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartTotal,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      loading
    }}>
      {children}
    </CartContext.Provider>
  );
};