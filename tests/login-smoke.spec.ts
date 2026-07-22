
import {customtest, expect} from '../fixtures/baseTest';
customtest.describe('EventHub auth shell', () => {
  customtest('login page loads and links to registration', async ({ app, page }) => {
    await app.loginPage.goto();
    await app.loginPage.assertLoaded();

    await expect(app.loginPage.emailInput).toHaveAttribute('placeholder', 'you@email.com');
    await expect(app.loginPage.passwordInput).toHaveAttribute('placeholder', '••••••');
    await expect(app.loginPage.signInButton).toBeVisible();

    await app.loginPage.openRegister();

    await expect(page).toHaveURL(/\/register$/);
    await app.registerPage.assertLoaded();
  });
});