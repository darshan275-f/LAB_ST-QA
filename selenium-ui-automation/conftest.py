"""Pytest fixtures for Selenium WebDriver lifecycle and failure screenshots."""

import sys
from datetime import datetime
from pathlib import Path

import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions

ROOT = Path(__file__).resolve().parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from config.config import BASE_URL, BROWSER, HEADLESS
from pages.cart_page import CartPage, ProductsPage
from pages.login_page import LoginPage
from utils.logger import get_logger

logger = get_logger(__name__)

SCREENSHOTS_DIR = ROOT / "screenshots"
REPORTS_DIR = ROOT / "reports"
SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)
REPORTS_DIR.mkdir(parents=True, exist_ok=True)


def pytest_configure(config):
    config._metadata = getattr(config, "_metadata", {})
    if hasattr(config, "_metadata"):
        config._metadata["Project"] = "ShopEase UI Automation"
        config._metadata["Base URL"] = BASE_URL


@pytest.fixture
def driver():
    logger.info("Starting %s browser", BROWSER)
    if BROWSER.lower() != "chrome":
        raise ValueError(f"Unsupported browser: {BROWSER}")

    options = ChromeOptions()
    if HEADLESS:
        options.add_argument("--headless=new")
    options.add_argument("--window-size=1440,900")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    # Suppress Chrome "Change your password" / save-password popups during login
    options.add_argument("--disable-features=PasswordLeakDetection,PasswordManagerOnboarding,AutofillServerCommunication")
    options.add_argument("--password-store=basic")
    options.add_experimental_option(
        "prefs",
        {
            "credentials_enable_service": False,
            "profile.password_manager_enabled": False,
            "profile.password_manager_leak_detection": False,
        },
    )
    options.add_experimental_option("excludeSwitches", ["enable-automation", "enable-logging"])

    driver = webdriver.Chrome(options=options)
    driver.maximize_window()
    yield driver
    logger.info("Quitting browser")
    driver.quit()


@pytest.fixture
def login_page(driver):
    return LoginPage(driver)


@pytest.fixture
def products_page(driver):
    return ProductsPage(driver)


@pytest.fixture
def cart_page(driver):
    return CartPage(driver)


@pytest.fixture
def authenticated_session(driver, login_page):
    """Log in with demo credentials and clear cart for test isolation."""
    from config.config import DEMO_EMAIL, DEMO_PASSWORD

    login_page.open_login()
    login_page.login(DEMO_EMAIL, DEMO_PASSWORD)
    login_page.wait_for_url_contains("/products")
    driver.execute_script(
        "window.localStorage.setItem('ecommerce_cart', '[]');"
        "window.localStorage.setItem('ecommerce_auth', "
        "JSON.stringify({email:'testuser@example.com',name:'Test User'}));"
    )
    driver.get(f"{BASE_URL}/products")
    products = ProductsPage(driver)
    products.find_visible(ProductsPage.PRODUCTS_PAGE)
    products.wait_for_badge_count(0)
    return driver


@pytest.hookimpl(hookwrapper=True, tryfirst=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report = outcome.get_result()
    setattr(item, f"rep_{report.when}", report)

    if report.when == "call" and report.failed:
        driver = item.funcargs.get("driver") or item.funcargs.get(
            "authenticated_session"
        )
        if driver is None:
            return

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_name = item.name.replace("/", "_").replace("\\", "_")
        screenshot_path = SCREENSHOTS_DIR / f"{safe_name}_{timestamp}.png"
        try:
            driver.save_screenshot(str(screenshot_path))
            logger.error("Saved failure screenshot: %s", screenshot_path)
            if hasattr(item.config, "_html"):
                # pytest-html may attach via extras in newer versions
                pass
        except Exception as exc:  # noqa: BLE001
            logger.error("Unable to capture screenshot: %s", exc)
