# Sauce Demo Playwright Tests

This folder contains Playwright tests for the Sauce Demo sample site.

How to run

1. Install dependencies (from repo root):

```powershell
npm install
npx playwright install
```

2. Run all saucedemo tests:

```powershell
npx playwright test tests/saucedemo
```

3. Run an individual spec (open it in VS Code and use Run/Debug, or copy-paste):

- Run the login spec with a single worker and list reporter:

```powershell
npx playwright test tests/saucedemo/login.spec.ts -j 1 --reporter=list
```

- Run the add-to-cart spec with a single worker and list reporter:

```powershell
npx playwright test tests/saucedemo/add_to_cart.spec.ts -j 1 --reporter=list
```

- Run the full folder serially (single worker):

```powershell
npx playwright test tests/saucedemo -j 1 --reporter=list
```

Notes & customization

- Default (public) credentials commonly used for Sauce Demo examples:
  - Username: `standard_user`
  - Password: `secret_sauce`

- Update selectors in the specs to match the target site if selectors differ.

Re-run & troubleshooting tips

- If a run is interrupted, rerun the failing spec directly with `-j 1` to avoid parallel interference.
- Use `--repeat-each N` to rerun flaky tests automatically (e.g., `--repeat-each 3`).
- For performance troubleshooting, try:
  - `--project=chromium` to isolate browser differences
  - `--headed` to observe UI behavior
  - `-j 1` to remove parallelization as a variable
  - `--timeout=60000` temporarily if external resources are slow
- Use Playwright tracing and screenshots for failures: enable `--trace on-first-retry` and `--retries 1` in commands or config.

Feel free to ask me to adapt this README wording or add a small PowerShell helper script to run a spec with standard flags (trace/screenshots/retries).