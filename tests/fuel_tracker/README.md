# Fuel Tracker Playwright Tests

This folder contains starter Playwright tests for the public demo at <https://fuel-tracker-4kyf.vercel.app/>.

How to run

1. Install dependencies (from repo root):

```powershell
npm install
npx playwright install
```

1. All test cases viwe:

```powershell
npx playwright test --list
npx playwright test tests/fuel_tracker --list
npx playwright test tests/saucedemo --list
```

2. Run all fuel-tracker tests:

```powershell
npx playwright test tests/fuel_tracker
```

3. To run an individual test file, open it in VS Code and use the tasks/Run buttons we added, or run:

```powershell
npx playwright test tests/fuel_tracker/auth.spec.ts
```

4. Open with the Chrome:

```powershell
npx playwright test tests/fuel_tracker/homepage.spec.ts --project=chromium --headed
```


Additional useful commands

1.Run the auth spec (helpful when re-running after an interruption):

```powershell
npx playwright test tests/fuel_tracker/auth.spec.ts -j 1 --reporter=list
```

- Run the at the chromium spec:

```powershell
 npx playwright test tests/fuel_tracker/homepage.spec.ts --project
 ```


- Run the auth spec (Chromium only) for performance troubleshooting:

```powershell
npx playwright test tests/fuel_tracker/auth.spec.ts --project=chromium --reporter=list
```

- Run the validation spec:

```powershell
npx playwright test tests/fuel_tracker/validation.spec.ts -j 1 --reporter=list
```

- Run the full fuel-tracker suite with a single worker (serial):

```powershell
npx playwright test tests/fuel_tracker -j 1 --reporter=list
```

## Notes & customization

The tests are defensive: they will skip if UI elements (Add/Login buttons) are not present or if environment variables are missing for login.

Default credentials (used when environment variables are not set):

- Fullname: Chamudi Rathnayaka
- Email: `chamudisashanka@haycarb.com`
- Password: `Chamudi@123`
- Fuel card number: `12345`

Update selectors to match the real site structure. For example, if the login input is `input#email` change the selector accordingly.

For live authentication tests, set environment variables in your shell:

```powershell
$env:FUEL_USERNAME = 'you@example.com'
$env:FUEL_PASSWORD = 'supersecret'
npx playwright test tests/fuel_tracker/auth.spec.ts
```

Feel free to ask me to adapt selectors to exact elements if you want me to inspect the site and refine the tests.

TypeScript in browser-context (clarifying note)

- Playwright test files are TypeScript/Node code that run in the test runner process. When you use `page.evaluate()` or similar APIs, the function you pass is serialized and executed inside the browser context where TypeScript types are not available. Keep these points in mind:

  - `page.evaluate(fn, ...args)` serializes `fn` to plain JS; avoid passing closures that reference Node-only globals.
  - If you want to use TS types for in-browser helper code, compile them ahead of time and ship plain JS to the page (or keep logic in the test process and pass only primitive data into `evaluate`).
  - Debugging tip: add `console.log` statements inside evaluate and run with `--project=chromium --reporter=list --debug` to surface browser console logs.

Re-run guidance / interrupted runs

- If a run is interrupted, re-run the failing spec directly (see commands above) with `-j 1` to avoid parallel interference.
- Use the `--repeat-each` flag to re-run flaky tests automatically, e.g. `--repeat-each 3`.
- Capture traces and screenshots for slow/failing tests with `--trace on-first-retry` and `--retries 1` in your Playwright config or command line.

Performance troubleshooting tips

- Use `--project=chromium` to rule out browser-specific issues.
- Disable headless mode (`--headed`) to observe UI behavior when diagnosing slowness.
- Start with `-j 1` to remove parallelization as a variable.
- Increase the test timeout temporarily (e.g., `--timeout=60000`) if external network or slow CI is suspected.
- Use Playwright's `page.pause()` and `browserContext.tracing.start()` / `tracing.stop()` to capture detailed traces.
