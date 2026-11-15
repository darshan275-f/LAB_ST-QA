import { describe, expect, it } from 'vitest';
import { PRODUCTS } from './products';

describe('PRODUCTS catalog invariants', () => {
  it('contains six sellable products', () => {
    expect(PRODUCTS).toHaveLength(6);
  });

  it('every product has unique id, name, description, image, and numeric price', () => {
    const ids = PRODUCTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const product of PRODUCTS) {
      expect(product.id).toMatch(/^prod-\d{3}$/);
      expect(product.name.length).toBeGreaterThan(0);
      expect(product.description.length).toBeGreaterThan(0);
      expect(product.image).toMatch(/^https?:\/\//);
      expect(typeof product.price).toBe('number');
      expect(product.price).toBeGreaterThan(0);
    }
  });
});
