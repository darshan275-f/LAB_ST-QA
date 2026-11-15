import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  CART_STORAGE_KEY,
  addToCart as addItem,
  clearCart as emptyCart,
  decreaseQuantity as decreaseItem,
  getItemCount,
  getSubtotal,
  getTotal,
  increaseQuantity as increaseItem,
  parseStoredCart,
  removeFromCart as removeItem,
} from '../logic/cart';

const CartContext = createContext(null);

function readStoredCart() {
  return parseStoredCart(localStorage.getItem(CART_STORAGE_KEY));
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product) => {
    setItems((prev) => addItem(prev, product));
  };

  const removeFromCart = (productId) => {
    setItems((prev) => removeItem(prev, productId));
  };

  const increaseQuantity = (productId) => {
    setItems((prev) => increaseItem(prev, productId));
  };

  const decreaseQuantity = (productId) => {
    setItems((prev) => decreaseItem(prev, productId));
  };

  const clearCart = () => setItems(emptyCart());

  const itemCount = getItemCount(items);
  const subtotal = getSubtotal(items);
  const total = getTotal(items);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      total,
      hydrated: true,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
    }),
    [items, itemCount, subtotal, total],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
