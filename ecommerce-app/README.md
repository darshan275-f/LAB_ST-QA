# ShopEase E-commerce App

React + Vite storefront with login, product catalog, and shopping cart.

## Demo credentials

- Email: `testuser@example.com`
- Password: `Test@123`

## Setup

```bash
cd ecommerce-app
npm install
npm run dev
```

App runs at [http://localhost:5173](http://localhost:5173).

## Features

- Login with validation, show/hide password, session persistence
- Protected routes for products and cart
- Product listing with add-to-cart
- Cart quantity controls, remove, totals, empty state
- Cart persisted in `localStorage`
- `data-testid` attributes for Selenium automation

## White-box unit tests (Vitest)

These tests inspect internal login/cart logic (branches, calculations, storage parsing). They do **not** need the app running.

```bash
cd ecommerce-app
npm install
npm test
npm run test:coverage
```

Coverage HTML report: `ecommerce-app/coverage/index.html`
