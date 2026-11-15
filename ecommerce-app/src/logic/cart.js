export const CART_STORAGE_KEY = 'ecommerce_cart';

export function parseStoredCart(raw) {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch {
    return [];
  }
}

export function addToCart(items, product) {
  const existing = items.find((item) => item.id === product.id);
  if (existing) {
    return items.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
    );
  }
  return [...items, { ...product, quantity: 1 }];
}

export function removeFromCart(items, productId) {
  return items.filter((item) => item.id !== productId);
}

export function increaseQuantity(items, productId) {
  return items.map((item) =>
    item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
  );
}

export function decreaseQuantity(items, productId) {
  return items
    .map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity - 1 } : item,
    )
    .filter((item) => item.quantity > 0);
}

export function clearCart() {
  return [];
}

export function getItemCount(items) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getSubtotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getTotal(items) {
  return getSubtotal(items);
}

export function getLineTotal(item) {
  return item.price * item.quantity;
}
