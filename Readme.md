Playwright:
===========
Playwright is the core browser automation library.
It will launch browser and automate the interaction but it dont include a test runner, assertion, fixtures and reporting

@Playwright/Test:
=================
@Playwright/test builds on top of playwright library and adds a complete testing framework with features like 
test()
expect()
hooks,
fixtures,
parallel execution
retires and reports

@playwright/test is a package typically used because it provides and end-to-end testing solution.


Explain the difference between page fixture and browser context?
=======================================================================
1. page fixture gives you one ready-to-use page for the test
2. browser context is a separate browser session container that can create its own pages
3. a fresh browser context starts with isolated state