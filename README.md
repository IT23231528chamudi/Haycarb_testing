# Playwright-testing-tool-evaluation
End-to-end testing using Playwright for the Software Testing Tool Evaluation assignment. Features automated browser testing, visual reports, and CI integration with GitHub Actions.

# 🧪 Playwright E-Commerce Demo


### 🎯 Overview
A simple automated testing project using **Microsoft Playwright** to verify login and add-to-cart features on [SauceDemo.com](https://www.saucedemo.com/).


### ⚙️ Setup
```bash
npm init playwright@latest
npm install
```


### ▶️ Run Tests
```bash
npx playwright test --headed
```



### 🧾 HTML Report
```bash
npx playwright show-report
```


### 🌐 Key Features
- Cross-browser (Chromium, Firefox, WebKit)
- Auto-waiting for elements
- Built-in assertions and HTML reports
- Record videos/screenshots on failure


### 📦 Folder Structure
```
/tests → contains test cases
/playwright.config.ts → config for browsers & reports
/.github/workflows/playwright.yml → CI setup
```


### 👥 Authors
Sashanka Rathnayaka, Chamoda Suraweera, Sandalika Gunawardhana
