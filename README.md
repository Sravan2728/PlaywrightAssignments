# EventHub JavaScript Playwright Starter Framework

This starter project is a working JavaScript Playwright framework used for the Section 7 migration assignment.

It intentionally includes reusable page objects, a custom fixture layer, Playwright configuration, and passing public-flow tests so students can focus on converting the framework to TypeScript rather than writing new business scenarios from scratch.

## Quick start

1. Run `npm install`
2. Run `npx playwright install chromium`
3. Run `npm test`

## Download-ready migration target

This project is intentionally kept in JavaScript and organized into multiple framework layers so students can migrate it to TypeScript end to end.

- `playwright.config.js` uses CommonJS and JS-only config exports
- `fixtures/baseTest.js` exposes custom fixtures used by the specs
- `pages/` contains reusable page-object classes
- `utils/` contains shared config, text normalization, and test data modules
- `tests/` contains passing specs that should keep the same titles and business intent after migration

## Current working coverage

- Login page smoke validation
- Register page password-rule validation and form-value assertions
- Swagger documentation new-tab validation from the login page

## Framework structure

- `playwright.config.js` for runtime configuration
- `fixtures/` for reusable custom test fixtures
- `pages/` for page object classes
- `tests/` for Playwright specs
- `utils/` for shared data and helper modules