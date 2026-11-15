"""Central configuration for Selenium UI tests."""

BASE_URL = "http://localhost:5173"
IMPLICIT_WAIT = 0
EXPLICIT_WAIT = 10
BROWSER = "chrome"
HEADLESS = False

DEMO_EMAIL = "testuser@example.com"
DEMO_PASSWORD = "Test@123"
INVALID_EMAIL = "wronguser@example.com"
INVALID_PASSWORD = "WrongPass@123"

# Stable product ids used by cart tests (must match React product data)
PRODUCT_ONE_ID = "prod-001"
PRODUCT_TWO_ID = "prod-002"
PRODUCT_THREE_ID = "prod-003"
