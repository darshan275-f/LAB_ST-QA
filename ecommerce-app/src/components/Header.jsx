import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-header" data-testid="app-header">
      <div className="header-inner">
        <Link to="/products" className="brand" data-testid="brand-link">
          ShopEase
        </Link>

        {isAuthenticated && (
          <nav className="header-nav" data-testid="main-nav">
            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
              data-testid="nav-products"
            >
              Products
            </NavLink>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                isActive ? 'nav-link active cart-nav' : 'nav-link cart-nav'
              }
              data-testid="nav-cart"
            >
              <span>Cart</span>
              <span className="cart-badge" data-testid="cart-badge">
                {itemCount}
              </span>
            </NavLink>
          </nav>
        )}

        {isAuthenticated && (
          <div className="header-user">
            <span className="user-email" data-testid="user-email">
              {user?.email}
            </span>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleLogout}
              data-testid="logout-button"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
