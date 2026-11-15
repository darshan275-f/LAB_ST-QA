import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    total,
    hydrated,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  if (!hydrated) {
    return (
      <div className="app-shell" data-testid="cart-page">
        <Header />
        <main className="page-content">
          <div className="page-loading" data-testid="cart-loading">
            Loading cart...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell" data-testid="cart-page">
      <Header />
      <main className="page-content">
        <div className="page-intro cart-intro">
          <div>
            <h1 data-testid="cart-heading">Shopping Cart</h1>
            <p data-testid="cart-item-count-text">
              {itemCount === 0
                ? 'Your cart is empty'
                : `${itemCount} item${itemCount === 1 ? '' : 's'} in your cart`}
            </p>
          </div>
          <Link
            to="/products"
            className="btn btn-secondary"
            data-testid="continue-shopping"
          >
            Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="empty-cart" data-testid="empty-cart">
            <h2 data-testid="empty-cart-title">Your cart is empty</h2>
            <p data-testid="empty-cart-message">
              Browse our products and add something you love.
            </p>
            <Link
              to="/products"
              className="btn btn-primary"
              data-testid="empty-cart-shop-button"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <ul className="cart-items" data-testid="cart-items">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="cart-item"
                  data-testid={`cart-item-${item.id}`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                    data-testid={`cart-item-image-${item.id}`}
                  />
                  <div className="cart-item-details">
                    <h3 data-testid={`cart-item-name-${item.id}`}>
                      {item.name}
                    </h3>
                    <p data-testid={`cart-item-description-${item.id}`}>
                      {item.description}
                    </p>
                    <span
                      className="cart-item-price"
                      data-testid={`cart-item-price-${item.id}`}
                    >
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="cart-item-actions">
                    <div
                      className="qty-controls"
                      data-testid={`qty-controls-${item.id}`}
                    >
                      <button
                        type="button"
                        className="btn btn-qty"
                        onClick={() => decreaseQuantity(item.id)}
                        data-testid={`decrease-qty-${item.id}`}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        −
                      </button>
                      <span
                        className="qty-value"
                        data-testid={`qty-value-${item.id}`}
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="btn btn-qty"
                        onClick={() => increaseQuantity(item.id)}
                        data-testid={`increase-qty-${item.id}`}
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                    <div
                      className="cart-item-line-total"
                      data-testid={`line-total-${item.id}`}
                    >
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeFromCart(item.id)}
                      data-testid={`remove-item-${item.id}`}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="cart-summary" data-testid="cart-summary">
              <h2 data-testid="summary-heading">Order Summary</h2>
              <div className="summary-row">
                <span>Items</span>
                <span data-testid="summary-item-count">{itemCount}</span>
              </div>
              <div className="summary-row">
                <span>Subtotal</span>
                <span data-testid="cart-subtotal">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="summary-row summary-total">
                <span>Total</span>
                <span data-testid="cart-total">${total.toFixed(2)}</span>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-full"
                data-testid="checkout-button"
              >
                Proceed to Checkout
              </button>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
