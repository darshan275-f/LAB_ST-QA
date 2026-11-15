"""Products and cart page objects."""

from selenium.webdriver.common.by import By

from config.config import BASE_URL, PRODUCT_ONE_ID
from pages.base_page import BasePage


class ProductsPage(BasePage):
    PATH = "/products"

    PRODUCTS_PAGE = (By.CSS_SELECTOR, "[data-testid='products-page']")
    PRODUCTS_HEADING = (By.CSS_SELECTOR, "[data-testid='products-heading']")
    PRODUCT_GRID = (By.CSS_SELECTOR, "[data-testid='product-grid']")
    NAV_CART = (By.CSS_SELECTOR, "[data-testid='nav-cart']")
    NAV_PRODUCTS = (By.CSS_SELECTOR, "[data-testid='nav-products']")
    CART_BADGE = (By.CSS_SELECTOR, "[data-testid='cart-badge']")
    LOGOUT_BUTTON = (By.CSS_SELECTOR, "[data-testid='logout-button']")
    USER_EMAIL = (By.CSS_SELECTOR, "[data-testid='user-email']")

    def open_products(self):
        self.open(f"{BASE_URL}{self.PATH}")
        self.find_visible(self.PRODUCTS_PAGE)
        self.find_clickable(
            (By.CSS_SELECTOR, f"[data-testid='add-to-cart-{PRODUCT_ONE_ID}']")
        )

    def is_loaded(self) -> bool:
        return self.is_displayed(self.PRODUCTS_PAGE) and self.is_displayed(
            self.PRODUCTS_HEADING
        )

    def add_to_cart(self, product_id: str):
        before = self.read_text_now(self.CART_BADGE) or "0"
        self.click((By.CSS_SELECTOR, f"[data-testid='add-to-cart-{product_id}']"))
        expected = str(int(before) + 1)
        self.wait.until(
            lambda driver: self.read_text_now(self.CART_BADGE) == expected
        )

    def get_product_name(self, product_id: str) -> str:
        return self.get_text(
            (By.CSS_SELECTOR, f"[data-testid='product-name-{product_id}']")
        )

    def get_product_price(self, product_id: str) -> str:
        return self.get_text(
            (By.CSS_SELECTOR, f"[data-testid='product-price-{product_id}']")
        )

    def get_cart_badge_count(self) -> int:
        return int(self.get_text(self.CART_BADGE))

    def go_to_cart(self):
        self.click(self.NAV_CART)
        self.wait_for_url_contains("/cart")
        self.find_visible((By.CSS_SELECTOR, "[data-testid='cart-page']"))

    def wait_for_badge_count(self, expected: int):
        self.wait.until(
            lambda driver: self.read_text_now(self.CART_BADGE) == str(expected)
        )

    def logout(self):
        self.click(self.LOGOUT_BUTTON)


class CartPage(BasePage):
    PATH = "/cart"

    CART_PAGE = (By.CSS_SELECTOR, "[data-testid='cart-page']")
    CART_HEADING = (By.CSS_SELECTOR, "[data-testid='cart-heading']")
    EMPTY_CART = (By.CSS_SELECTOR, "[data-testid='empty-cart']")
    EMPTY_CART_TITLE = (By.CSS_SELECTOR, "[data-testid='empty-cart-title']")
    CART_ITEMS = (By.CSS_SELECTOR, "[data-testid='cart-items']")
    CART_SUBTOTAL = (By.CSS_SELECTOR, "[data-testid='cart-subtotal']")
    CART_TOTAL = (By.CSS_SELECTOR, "[data-testid='cart-total']")
    SUMMARY_ITEM_COUNT = (By.CSS_SELECTOR, "[data-testid='summary-item-count']")
    CONTINUE_SHOPPING = (By.CSS_SELECTOR, "[data-testid='continue-shopping']")
    EMPTY_CART_SHOP_BUTTON = (
        By.CSS_SELECTOR,
        "[data-testid='empty-cart-shop-button']",
    )
    CART_BADGE = (By.CSS_SELECTOR, "[data-testid='cart-badge']")
    NAV_PRODUCTS = (By.CSS_SELECTOR, "[data-testid='nav-products']")

    def open_cart(self):
        self.open(f"{BASE_URL}{self.PATH}")

    def is_loaded(self) -> bool:
        return self.is_displayed(self.CART_PAGE) and self.is_displayed(
            self.CART_HEADING
        )

    def is_empty(self) -> bool:
        return self.is_displayed(self.EMPTY_CART)

    def get_empty_title(self) -> str:
        return self.get_text(self.EMPTY_CART_TITLE)

    def cart_item_locator(self, product_id: str):
        return (By.CSS_SELECTOR, f"[data-testid='cart-item-{product_id}']")

    def is_product_in_cart(self, product_id: str) -> bool:
        return self.is_displayed(self.cart_item_locator(product_id))

    def get_item_name(self, product_id: str) -> str:
        return self.get_text(
            (By.CSS_SELECTOR, f"[data-testid='cart-item-name-{product_id}']")
        )

    def get_item_price(self, product_id: str) -> str:
        return self.get_text(
            (By.CSS_SELECTOR, f"[data-testid='cart-item-price-{product_id}']")
        )

    def get_item_quantity(self, product_id: str) -> int:
        return int(
            self.get_text(
                (By.CSS_SELECTOR, f"[data-testid='qty-value-{product_id}']")
            )
        )

    def increase_quantity(self, product_id: str):
        self.click(
            (By.CSS_SELECTOR, f"[data-testid='increase-qty-{product_id}']")
        )

    def decrease_quantity(self, product_id: str):
        self.click(
            (By.CSS_SELECTOR, f"[data-testid='decrease-qty-{product_id}']")
        )

    def remove_item(self, product_id: str):
        self.click((By.CSS_SELECTOR, f"[data-testid='remove-item-{product_id}']"))

    def get_subtotal(self) -> str:
        return self.get_text(self.CART_SUBTOTAL)

    def get_total(self) -> str:
        return self.get_text(self.CART_TOTAL)

    def get_summary_item_count(self) -> int:
        return int(self.get_text(self.SUMMARY_ITEM_COUNT))

    def get_cart_badge_count(self) -> int:
        return int(self.get_text(self.CART_BADGE))

    def continue_shopping(self):
        self.click(self.CONTINUE_SHOPPING)
        self.wait_for_url_contains("/products")

    def browse_products_from_empty(self):
        self.click(self.EMPTY_CART_SHOP_BUTTON)
        self.wait_for_url_contains("/products")

    def go_to_products(self):
        self.click(self.NAV_PRODUCTS)
        self.wait_for_url_contains("/products")

    def wait_for_empty(self):
        self.find_visible(self.EMPTY_CART)

    def wait_for_product(self, product_id: str):
        self.find_visible(self.cart_item_locator(product_id))

    def wait_for_quantity(self, product_id: str, expected: int):
        locator = (By.CSS_SELECTOR, f"[data-testid='qty-value-{product_id}']")
        self.wait.until(lambda driver: self.get_text(locator) == str(expected))
