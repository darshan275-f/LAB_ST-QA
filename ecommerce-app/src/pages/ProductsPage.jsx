import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../data/products';

export default function ProductsPage() {
  return (
    <div className="app-shell" data-testid="products-page">
      <Header />
      <main className="page-content">
        <div className="page-intro">
          <h1 data-testid="products-heading">Our Products</h1>
          <p data-testid="products-subheading">
            Curated essentials for everyday living.
          </p>
        </div>

        <div className="product-grid" data-testid="product-grid">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}
