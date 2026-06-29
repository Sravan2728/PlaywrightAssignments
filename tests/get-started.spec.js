import {test, expect} from '@playwright/test';
import {loginPage} from '../utils/loginPage';
test('EventHub login page loads', async({page}) => {
    const login = new loginPage(page);
    await login.openLoginPage();
    await expect(page.getByPlaceholder('you@email.com')).toBeVisible();
    await expect(page.getByRole('button', {name: 'Sign In'})).toBeVisible();
    //Playwright actions return promises and await prevents timing issues and flaky behavior
});

test.only('Simple login page test', async({page}) => {
    const login = new loginPage(page);
    await login.openLoginPage();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.url()).toContain('/login');
    await expect(page.locator('h1')).toBeVisible();
});