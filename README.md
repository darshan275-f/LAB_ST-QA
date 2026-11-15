# ShopEase — How to Run App, Tests & View Report

This project has 2 parts:

| Folder | What it is |
|--------|------------|
| `ecommerce-app/` | React website (login + products + cart) + **white-box unit tests** |
| `selenium-ui-automation/` | **Black-box** UI tests (Python + Selenium + Pytest) |

---

## Testing types in this project

| Kind | Tool | Needs app running? | Report |
|------|------|--------------------|--------|
| **White-box unit tests** | Vitest | No | `ecommerce-app/coverage/index.html` |
| **Black-box E2E / UI tests** | Selenium + Pytest | Yes (`npm run dev`) | `selenium-ui-automation/reports/report.html` |

### White-box (inside the code)

Run from `ecommerce-app` — tests login branches, cart math, storage parsing, protected-route decisions:

```powershell
cd C:\Users\Lenovo\OneDrive\Desktop\p\ecommerce-app
npm install
npm test
npm run test:coverage
start .\coverage\index.html
```

### Black-box (user / browser)

Keep the app running, then run Selenium as in the steps below.

**Demo login:** `testuser@example.com` / `Test@123`

---

## Step 1 — Run the website (keep this terminal open)

Open **Terminal 1**:

```powershell
cd C:\Users\Lenovo\OneDrive\Desktop\p\ecommerce-app
npm install
npm run dev
```

When it says the app is ready, open this in your browser:

**http://localhost:5173**

You can log in with the demo credentials above and use the site manually.

> Keep this terminal running. Do **not** close it while running tests.

---

## Step 2 — Install test dependencies (one-time setup)

Open **Terminal 2** (new window):

```powershell
cd C:\Users\Lenovo\OneDrive\Desktop\p\selenium-ui-automation
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

---

## Step 3 — Run all tests (report is created automatically)

In the same Terminal 2 (venv still activated):

```powershell
cd C:\Users\Lenovo\OneDrive\Desktop\p\selenium-ui-automation
.\.venv\Scripts\activate
pytest
```

What happens:

1. Chrome opens and runs login + cart tests
2. Pass/fail results print in the terminal
3. An **HTML report is generated automatically** at:

`C:\Users\Lenovo\OneDrive\Desktop\p\selenium-ui-automation\reports\report.html`

---

## Step 4 — How to open / get the test results report

### Option A — File Explorer
1. Go to folder: `selenium-ui-automation\reports\`
2. Double-click `report.html`
3. It opens in your browser with all test results

### Option B — PowerShell
```powershell
start C:\Users\Lenovo\OneDrive\Desktop\p\selenium-ui-automation\reports\report.html
```

### What you will see in the report
- Total tests run
- Passed / Failed / Skipped
- Each test name and duration
- Error details for failed tests
- Self-contained HTML (works offline)

### Extra result files
| File | Purpose |
|------|---------|
| `reports/report.html` | Main HTML test report |
| `reports/test_run.log` | Text log of the run |
| `screenshots/*.png` | Screenshots only when a test fails |

---

## Useful test commands

```powershell
# Activate venv first
cd C:\Users\Lenovo\OneDrive\Desktop\p\selenium-ui-automation
.\.venv\Scripts\activate

# Run ALL tests + generate report
pytest

# Run only login tests
pytest tests/test_login.py

# Run only cart tests
pytest tests/test_cart.py

# Run and force a fresh report path (same default file)
pytest --html=reports/report.html --self-contained-html
```

Every `pytest` run overwrites `reports/report.html` with the latest results.

---

## Quick checklist if something fails

1. Is the app running on **http://localhost:5173**?
2. Is Google Chrome installed?
3. Did you activate the venv? (`.\.venv\Scripts\activate`)
4. Did you install requirements? (`pip install -r requirements.txt`)

App URL can be changed in:

`selenium-ui-automation\config\config.py` → `BASE_URL`
