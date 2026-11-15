"""Login page automation test cases."""

import pytest

from config.config import (
    BASE_URL,
    DEMO_EMAIL,
    DEMO_PASSWORD,
    INVALID_EMAIL,
    INVALID_PASSWORD,
)
from pages.cart_page import ProductsPage
from pages.login_page import LoginPage
from utils.logger import get_logger

logger = get_logger(__name__)


class TestLogin:
    def test_login_page_loads(self, login_page: LoginPage):
        login_page.open_login()
        assert login_page.is_loaded()
        assert "/login" in login_page.current_url()

    def test_login_with_valid_credentials(self, login_page: LoginPage, products_page):
        login_page.open_login()
        login_page.login(DEMO_EMAIL, DEMO_PASSWORD)
        login_page.wait_for_url_contains("/products")
        assert products_page.is_loaded()

    def test_login_with_invalid_email(self, login_page: LoginPage):
        login_page.open_login()
        login_page.login(INVALID_EMAIL, DEMO_PASSWORD)
        assert login_page.is_error_displayed()
        assert "Invalid email or password" in login_page.get_error_message()
        assert "/login" in login_page.current_url()

    def test_login_with_invalid_password(self, login_page: LoginPage):
        login_page.open_login()
        login_page.login(DEMO_EMAIL, INVALID_PASSWORD)
        assert login_page.is_error_displayed()
        assert "Invalid email or password" in login_page.get_error_message()

    def test_login_with_empty_fields(self, login_page: LoginPage):
        login_page.open_login()
        login_page.click_login()
        assert login_page.is_error_displayed()
        assert "required" in login_page.get_error_message().lower()

    def test_password_masking(self, login_page: LoginPage):
        login_page.open_login()
        login_page.enter_password(DEMO_PASSWORD)
        assert login_page.get_password_input_type() == "password"
        login_page.toggle_password_visibility()
        assert login_page.get_password_input_type() == "text"
        assert login_page.get_toggle_text().lower() == "hide"
        login_page.toggle_password_visibility()
        assert login_page.get_password_input_type() == "password"

    def test_successful_redirection(self, login_page: LoginPage, products_page):
        login_page.open_login()
        login_page.login(DEMO_EMAIL, DEMO_PASSWORD)
        login_page.wait_for_url_contains("/products")
        assert login_page.current_url().startswith(f"{BASE_URL}/products")
        assert products_page.is_displayed(ProductsPage.USER_EMAIL)

    def test_logout(self, login_page: LoginPage, products_page):
        login_page.open_login()
        login_page.login(DEMO_EMAIL, DEMO_PASSWORD)
        login_page.wait_for_url_contains("/products")
        products_page.logout()
        login_page.wait_for_url_contains("/login")
        assert login_page.is_loaded()

    def test_protected_route_access(self, driver, login_page: LoginPage):
        # Ensure no session
        login_page.open_login()
        login_page.clear_storage()
        driver.get(f"{BASE_URL}/products")
        login_page.wait_for_url_contains("/login")
        assert login_page.is_loaded()

        driver.get(f"{BASE_URL}/cart")
        login_page.wait_for_url_contains("/login")
        assert login_page.is_loaded()
