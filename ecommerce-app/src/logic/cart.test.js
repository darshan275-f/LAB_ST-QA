import { describe, expect, it } from 'vitest';
import { PRODUCTS } from '../data/products';
import {
  addToCart,
  clearCart,
  decreaseQuantity,
  getItemCount,
  getLineTotal,
  getSubtotal,
  getTotal,
  increaseQuantity,
  parseStoredCart,
  removeFromCart,
} from './cart';

const headphones = PRODUCTS[0];
const watch = PRODUCTS[1];

describe('parseStoredCart (storage branches)', () => {
  it('returns [] when storage is empty', () => {
    expect(parseStoredCart(null)).toEqual([]);
    expect(parseStoredCart('')).toEqual([]);
  });

  it('returns [] for invalid JSON (catch branch)', () => {
    expect(parseStoredCart('{bad')).toEqual([]);
  });

  it('returns [] when JSON is not an array', () => {
    expect(parseStoredCart('{"id":"prod-001"}')).toEqual([]);
  });

  it('returns parsed array when valid', () => {
    const stored = [{ ...headphones, quantity: 2 }];
    expect(parseStoredCart(JSON.stringify(stored))).toEqual(stored);
  });
});

describe('addToCart (new vs existing item branches)', () => {
  it('adds a new product with quantity 1', () => {
    const next = addToCart([], headphones);
    expect(next).toHaveLength(1);
    expect(next[0].id).toBe(headphones.id);
    expect(next[0].quantity).toBe(1);
  });

  it('increments quantity when the same product already exists', () => {
    const once = addToCart([], headphones);
    const twice = addToCart(once, headphones);
    expect(twice).toHaveLength(1);
    expect(twice[0].quantity).toBe(2);
  });

  it('does not change quantity of other products when adding a new one', () => {
    const withHeadphones = addToCart([], headphones);
    const withBoth = addToCart(withHeadphones, watch);
    expect(withBoth).toHaveLength(2);
    expect(withBoth.find((i) => i.id === headphones.id).quantity).toBe(1);
    expect(withBoth.find((i) => i.id === watch.id).quantity).toBe(1);
  });

  it('increments only the matching line when cart already has other products', () => {
    let items = addToCart([], headphones);
    items = addToCart(items, watch);
    items = addToCart(items, headphones);
    expect(items.find((i) => i.id === headphones.id).quantity).toBe(2);
    expect(items.find((i) => i.id === watch.id).quantity).toBe(1);
  });
});

describe('quantity mutations', () => {
  it('increaseQuantity only updates the matching product id', () => {
    let items = addToCart([], headphones);
    items = addToCart(items, watch);
    items = increaseQuantity(items, headphones.id);
    expect(items.find((i) => i.id === headphones.id).quantity).toBe(2);
    expect(items.find((i) => i.id === watch.id).quantity).toBe(1);
  });

  it('decreaseQuantity reduces qty but keeps the line when qty > 0', () => {
    let items = addToCart([], headphones);
    items = increaseQuantity(items, headphones.id);
    items = decreaseQuantity(items, headphones.id);
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(1);
  });

  it('decreaseQuantity removes the line when qty would drop to 0 (filter branch)', () => {
    let items = addToCart([], headphones);
    items = decreaseQuantity(items, headphones.id);
    expect(items).toEqual([]);
  });

  it('decreaseQuantity leaves other products unchanged', () => {
    let items = addToCart([], headphones);
    items = increaseQuantity(items, headphones.id);
    items = addToCart(items, watch);
    items = decreaseQuantity(items, headphones.id);
    expect(items.find((i) => i.id === headphones.id).quantity).toBe(1);
    expect(items.find((i) => i.id === watch.id).quantity).toBe(1);
  });

  it('removeFromCart drops only the selected product', () => {
    let items = addToCart([], headphones);
    items = addToCart(items, watch);
    items = removeFromCart(items, headphones.id);
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe(watch.id);
  });

  it('clearCart returns an empty list', () => {
    expect(clearCart()).toEqual([]);
  });
});

describe('totals (statement + calculation coverage)', () => {
  it('itemCount sums quantities, not unique products', () => {
    let items = addToCart([], headphones);
    items = addToCart(items, headphones);
    items = addToCart(items, watch);
    expect(getItemCount(items)).toBe(3);
  });

  it('subtotal equals price * quantity for one product', () => {
    const items = addToCart([], headphones);
    expect(getSubtotal(items)).toBe(249.99);
    expect(getLineTotal(items[0])).toBe(249.99);
  });

  it('subtotal and total stay in sync for mixed cart', () => {
    let items = addToCart([], headphones);
    items = addToCart(items, headphones);
    items = addToCart(items, watch);
    const expected = 249.99 * 2 + 199.99;
    expect(getSubtotal(items)).toBeCloseTo(expected, 2);
    expect(getTotal(items)).toBe(getSubtotal(items));
  });

  it('empty cart totals are zero', () => {
    expect(getItemCount([])).toBe(0);
    expect(getSubtotal([])).toBe(0);
    expect(getTotal([])).toBe(0);
  });
});
