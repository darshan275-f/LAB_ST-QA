"""Base page object with shared wait and interaction helpers."""

from selenium.common.exceptions import TimeoutException
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from config.config import EXPLICIT_WAIT
from utils.logger import get_logger

logger = get_logger(__name__)


class BasePage:
    def __init__(self, driver: WebDriver):
        self.driver = driver
        self.wait = WebDriverWait(driver, EXPLICIT_WAIT)

    def open(self, url: str):
        logger.info("Opening URL: %s", url)
        self.driver.get(url)

    def find(self, locator):
        return self.wait.until(EC.presence_of_element_located(locator))

    def find_visible(self, locator):
        return self.wait.until(EC.visibility_of_element_located(locator))

    def find_clickable(self, locator):
        return self.wait.until(EC.element_to_be_clickable(locator))

    def click(self, locator):
        logger.info("Clicking element: %s", locator)
        element = self.find_clickable(locator)
        self.driver.execute_script(
            "arguments[0].scrollIntoView({block: 'center'});", element
        )
        try:
            element.click()
        except Exception:
            self.driver.execute_script("arguments[0].click();", element)

    def type_text(self, locator, text: str, clear: bool = True):
        element = self.find_visible(locator)
        if clear:
            element.clear()
        element.send_keys(text)
        logger.info("Typed into %s", locator)

    def get_text(self, locator) -> str:
        return self.find_visible(locator).text.strip()

    def read_text_now(self, locator) -> str:
        elements = self.driver.find_elements(*locator)
        if not elements:
            return ""
        return elements[0].text.strip()

    def is_displayed(self, locator) -> bool:
        try:
            return self.find_visible(locator).is_displayed()
        except TimeoutException:
            return False

    def get_attribute(self, locator, attribute: str) -> str:
        return self.find(locator).get_attribute(attribute)

    def wait_for_url_contains(self, fragment: str):
        self.wait.until(EC.url_contains(fragment))

    def current_url(self) -> str:
        return self.driver.current_url

    def refresh(self):
        logger.info("Refreshing page")
        self.driver.refresh()

    def clear_storage(self):
        self.driver.execute_script("window.localStorage.clear();")
