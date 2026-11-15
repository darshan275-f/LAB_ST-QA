"""Login page object."""

from selenium.webdriver.common.by import By

from config.config import BASE_URL
from pages.base_page import BasePage


class LoginPage(BasePage):
    PATH = "/login"

    LOGIN_PAGE = (By.CSS_SELECTOR, "[data-testid='login-page']")
    LOGIN_TITLE = (By.CSS_SELECTOR, "[data-testid='login-title']")
    EMAIL_INPUT = (By.CSS_SELECTOR, "[data-testid='email-input']")
    PASSWORD_INPUT = (By.CSS_SELECTOR, "[data-testid='password-input']")
    TOGGLE_PASSWORD = (By.CSS_SELECTOR, "[data-testid='toggle-password']")
    LOGIN_BUTTON = (By.CSS_SELECTOR, "[data-testid='login-button']")
    LOGIN_ERROR = (By.CSS_SELECTOR, "[data-testid='login-error']")
    LOGIN_FORM = (By.CSS_SELECTOR, "[data-testid='login-form']")

    def open_login(self):
        self.open(f"{BASE_URL}{self.PATH}")
        self.find_visible(self.LOGIN_PAGE)

    def is_loaded(self) -> bool:
        return self.is_displayed(self.LOGIN_PAGE) and self.is_displayed(
            self.LOGIN_TITLE
        )

    def enter_email(self, email: str):
        self.type_text(self.EMAIL_INPUT, email)

    def enter_password(self, password: str):
        self.type_text(self.PASSWORD_INPUT, password)

    def click_login(self):
        self.click(self.LOGIN_BUTTON)

    def login(self, email: str, password: str):
        self.enter_email(email)
        self.enter_password(password)
        self.click_login()

    def get_error_message(self) -> str:
        return self.get_text(self.LOGIN_ERROR)

    def is_error_displayed(self) -> bool:
        return self.is_displayed(self.LOGIN_ERROR)

    def get_password_input_type(self) -> str:
        return self.get_attribute(self.PASSWORD_INPUT, "type")

    def toggle_password_visibility(self):
        self.click(self.TOGGLE_PASSWORD)

    def get_toggle_text(self) -> str:
        return self.get_text(self.TOGGLE_PASSWORD)
