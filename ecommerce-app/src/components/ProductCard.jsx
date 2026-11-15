import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart, items } = useCart();
  const inCart = items.find((item) => item.id === product.id);

  const handleAdd = () => {
    addToCart(product);
  };

  return (
    <article
      className="product-card"
      data-testid={`product-card-${product.id}`}
    >
      <div className="product-image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          data-testid={`product-image-${product.id}`}
        />
      </div>
      <div className="product-body">
        <h3 className="product-name" data-testid={`product-name-${product.id}`}>
          {product.name}
        </h3>
        <p
          className="product-description"
          data-testid={`product-description-${product.id}`}
        >
          {product.description}
        </p>
        <div className="product-footer">
          <span
            className="product-price"
            data-testid={`product-price-${product.id}`}
          >
            ${product.price.toFixed(2)}
          </span>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAdd}
            data-testid={`add-to-cart-${product.id}`}
          >
            {inCart ? 'Add Another' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  );
}
