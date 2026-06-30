import {test, expect} from '@playwright/test';
import {loginPage} from '../../utils/loginPage'
test('Assignment2', async({page}) => {

await page.goto("/login");
await expect(page).toHaveTitle(/EventHub/i);
await expect(page.getByPlaceholder('you@email.com')).toBeVisible();
await expect(page.getByRole('button',{name: 'Sign In'})).toBeVisible();
});

test('Test2', async({page,browser}) => {
    const login = new loginPage(page);
    await login.openLoginPage();
    await page.getByPlaceholder('you@email.com').fill('beginner@sample.com');
    const emailInput = await page.getByPlaceholder('you@email.com').inputValue();
    await expect(emailInput).toBe('beginner@sample.com');

    const isolatedContext = await browser.newContext();
    const isolatedPage = await isolatedContext.newPage();

    await isolatedPage.goto("https://eventhub.rahulshettyacademy.com/login");
    await expect(isolatedPage.locator('h1')).toHaveText('Sign in to EventHub');
    const emailInput1 = await isolatedPage.getByPlaceholder('you@email.com').inputValue();
    await expect(emailInput1).toBe("");
    await isolatedContext.close();
});