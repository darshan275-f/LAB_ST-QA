# Selenium UI Automation — Run Tests & Get Report

These are **black-box UI / E2E tests**. They drive Chrome like a user and do not inspect React source.

White-box unit tests live in `ecommerce-app` (`npm test` / `npm run test:coverage`).

Tests run against the ShopEase app at `http://localhost:5173`.

**Before testing:** start the app in another terminal:

```powershell
cd C:\Users\Lenovo\OneDrive\Desktop\p\ecommerce-app
npm run dev
```

---

## First-time setup

```powershell
cd C:\Users\Lenovo\OneDrive\Desktop\p\selenium-ui-automation
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

---

## Run tests (HTML report is auto-generated)

```powershell
cd C:\Users\Lenovo\OneDrive\Desktop\p\selenium-ui-automation
.\.venv\Scripts\activate
pytest
```

Pytest is already configured (in `pytest.ini`) to write:

- `reports/report.html` — full HTML results report
- Console pass/fail output while tests run

---

## Open the test report

```powershell
start .\reports\report.html
```

Or open this file in Chrome/Edge:

`selenium-ui-automation\reports\report.html`

The report shows:
- summary (passed/failed)
- every test case result
- failure details (if any)

Failed tests also save screenshots in `screenshots\`.

---

## Other commands

```powershell
pytest tests/test_login.py
pytest tests/test_cart.py
pytest --html=reports/report.html --self-contained-html
```

## Demo credentials

- Email: `testuser@example.com`
- Password: `Test@123`


npm run test:coverage