"""Shopping cart automation test cases."""

from config.config import PRODUCT_ONE_ID, PRODUCT_THREE_ID, PRODUCT_TWO_ID
from pages.cart_page import CartPage, ProductsPage
from utils.logger import get_logger

logger = get_logger(__name__)


class TestCart:
    def test_cart_page_loads(self, authenticated_session, cart_page: CartPage):
        cart_page.open_cart()
        assert cart_page.is_loaded()
        assert "/cart" in cart_page.current_url()

    def test_add_product_to_cart(
        self, authenticated_session, products_page: ProductsPage, cart_page: CartPage
    ):
        products_page.open_products()
        products_page.add_to_cart(PRODUCT_ONE_ID)
        products_page.wait_for_badge_count(1)
        products_page.go_to_cart()
        cart_page.wait_for_product(PRODUCT_ONE_ID)
        assert cart_page.is_product_in_cart(PRODUCT_ONE_ID)

    def test_verify_product_details(
        self, authenticated_session, products_page: ProductsPage, cart_page: CartPage
    ):
        products_page.open_products()
        expected_name = products_page.get_product_name(PRODUCT_ONE_ID)
        expected_price = products_page.get_product_price(PRODUCT_ONE_ID)
        products_page.add_to_cart(PRODUCT_ONE_ID)
        products_page.wait_for_badge_count(1)
        products_page.go_to_cart()
        cart_page.wait_for_product(PRODUCT_ONE_ID)
        assert cart_page.get_item_name(PRODUCT_ONE_ID) == expected_name
        assert cart_page.get_item_price(PRODUCT_ONE_ID) == expected_price

    def test_increase_quantity(
        self, authenticated_session, products_page: ProductsPage, cart_page: CartPage
    ):
        products_page.open_products()
        products_page.add_to_cart(PRODUCT_ONE_ID)
        products_page.wait_for_badge_count(1)
        products_page.go_to_cart()
        cart_page.wait_for_product(PRODUCT_ONE_ID)
        assert cart_page.get_item_quantity(PRODUCT_ONE_ID) == 1
        cart_page.increase_quantity(PRODUCT_ONE_ID)
        cart_page.wait_for_quantity(PRODUCT_ONE_ID, 2)
        assert cart_page.get_item_quantity(PRODUCT_ONE_ID) == 2

    def test_decrease_quantity(
        self, authenticated_session, products_page: ProductsPage, cart_page: CartPage
    ):
        products_page.open_products()
        products_page.add_to_cart(PRODUCT_ONE_ID)
        products_page.wait_for_badge_count(1)
        products_page.go_to_cart()
        cart_page.wait_for_product(PRODUCT_ONE_ID)
        cart_page.increase_quantity(PRODUCT_ONE_ID)
        cart_page.wait_for_quantity(PRODUCT_ONE_ID, 2)
        cart_page.decrease_quantity(PRODUCT_ONE_ID)
        cart_page.wait_for_quantity(PRODUCT_ONE_ID, 1)
        assert cart_page.get_item_quantity(PRODUCT_ONE_ID) == 1

    def test_remove_product(
        self, authenticated_session, products_page: ProductsPage, cart_page: CartPage
    ):
        products_page.open_products()
        products_page.add_to_cart(PRODUCT_ONE_ID)
        products_page.wait_for_badge_count(1)
        products_page.go_to_cart()
        cart_page.wait_for_product(PRODUCT_ONE_ID)
        cart_page.remove_item(PRODUCT_ONE_ID)
        cart_page.wait_for_empty()
        assert cart_page.is_empty()

    def test_subtotal_and_total(
        self, authenticated_session, products_page: ProductsPage, cart_page: CartPage
    ):
        products_page.open_products()
        products_page.add_to_cart(PRODUCT_ONE_ID)
        products_page.wait_for_badge_count(1)
        products_page.add_to_cart(PRODUCT_ONE_ID)
        products_page.wait_for_badge_count(2)
        products_page.go_to_cart()
        cart_page.wait_for_product(PRODUCT_ONE_ID)
        # 249.99 * 2
        assert cart_page.get_subtotal() == "$499.98"
        assert cart_page.get_total() == "$499.98"
        assert cart_page.get_summary_item_count() == 2

    def test_empty_cart(self, authenticated_session, cart_page: CartPage):
        cart_page.open_cart()
        cart_page.wait_for_empty()
        assert cart_page.is_empty()
        assert "empty" in cart_page.get_empty_title().lower()

    def test_add_multiple_products(
        self, authenticated_session, products_page: ProductsPage, cart_page: CartPage
    ):
        products_page.open_products()
        products_page.add_to_cart(PRODUCT_ONE_ID)
        products_page.wait_for_badge_count(1)
        products_page.add_to_cart(PRODUCT_TWO_ID)
        products_page.wait_for_badge_count(2)
        products_page.add_to_cart(PRODUCT_THREE_ID)
        products_page.wait_for_badge_count(3)
        products_page.go_to_cart()
        cart_page.wait_for_product(PRODUCT_ONE_ID)
        assert cart_page.is_product_in_cart(PRODUCT_ONE_ID)
        assert cart_page.is_product_in_cart(PRODUCT_TWO_ID)
        assert cart_page.is_product_in_cart(PRODUCT_THREE_ID)
        assert cart_page.get_summary_item_count() == 3

    def test_cart_persistence_after_refresh(
        self, authenticated_session, products_page: ProductsPage, cart_page: CartPage
    ):
        products_page.open_products()
        products_page.add_to_cart(PRODUCT_TWO_ID)
        products_page.wait_for_badge_count(1)
        products_page.go_to_cart()
        cart_page.wait_for_product(PRODUCT_TWO_ID)
        cart_page.refresh()
        cart_page.wait_for_product(PRODUCT_TWO_ID)
        assert cart_page.is_loaded()
        assert cart_page.is_product_in_cart(PRODUCT_TWO_ID)
        assert cart_page.get_item_quantity(PRODUCT_TWO_ID) == 1

    def test_cart_item_count(
        self, authenticated_session, products_page: ProductsPage, cart_page: CartPage
    ):
        products_page.open_products()
        products_page.add_to_cart(PRODUCT_ONE_ID)
        products_page.wait_for_badge_count(1)
        products_page.add_to_cart(PRODUCT_TWO_ID)
        products_page.wait_for_badge_count(2)
        products_page.go_to_cart()
        cart_page.wait_for_product(PRODUCT_ONE_ID)
        cart_page.increase_quantity(PRODUCT_ONE_ID)
        cart_page.wait_for_quantity(PRODUCT_ONE_ID, 2)
        assert cart_page.get_cart_badge_count() == 3
        assert cart_page.get_summary_item_count() == 3

    def test_navigation_between_product_and_cart(
        self, authenticated_session, products_page: ProductsPage, cart_page: CartPage
    ):
        products_page.open_products()
        assert products_page.is_loaded()
        products_page.go_to_cart()
        assert cart_page.is_loaded()
        cart_page.continue_shopping()
        assert products_page.is_loaded()
        products_page.add_to_cart(PRODUCT_ONE_ID)
        products_page.wait_for_badge_count(1)
        products_page.go_to_cart()
        cart_page.wait_for_product(PRODUCT_ONE_ID)
        cart_page.remove_item(PRODUCT_ONE_ID)
        cart_page.wait_for_empty()
        cart_page.browse_products_from_empty()
        assert products_page.is_loaded()
