import { customtest, expect } from '../fixtures/baseTest';
import { expectedPasswordRules } from '../utils/testData';
import { normalizeVisibleTexts } from '../utils/textParsers';

customtest.describe('EventHub registration shell', () => {
  customtest('register page shows password rules and preserves typed values', async ({
    app,
    page,
    registrationUser,
  }) => {
    await app.registerPage.goto();
    await app.registerPage.assertLoaded();

    const rules = normalizeVisibleTexts(await app.registerPage.getPasswordRules());
    expect(rules).toEqual(expect.arrayContaining(expectedPasswordRules));

    await app.registerPage.fillRegistrationForm(registrationUser);

    await expect(app.registerPage.emailInput).toHaveValue(registrationUser.email);
    await expect(app.registerPage.passwordInput).toHaveValue(registrationUser.password);
    await expect(app.registerPage.confirmPasswordInput).toHaveValue(registrationUser.confirmPassword);
    await expect(app.registerPage.createAccountButton).toBeVisible();

    await app.registerPage.goToSignIn();

    await expect(page).toHaveURL(/\/login$/);
    await app.loginPage.assertLoaded();
  });
});