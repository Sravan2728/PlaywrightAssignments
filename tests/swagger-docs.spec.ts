import { customtest, expect } from '../fixtures/baseTest';
import { SwaggerDocsPage } from '../pages/SwaggerDocsPage';
import { appConfig } from '../utils/appConfig';

customtest.describe('EventHub API docs link', () => {
  customtest('login page opens Swagger docs in a new tab', async ({ app }) => {
    await app.loginPage.goto();
    await app.loginPage.assertLoaded();

    const docsPage = await app.loginPage.openSwaggerDocs();
    const swaggerDocsPage = new SwaggerDocsPage(docsPage);

    await swaggerDocsPage.assertLoaded();

    await expect(docsPage).toHaveURL(appConfig.apiDocsUrl);
    await expect(swaggerDocsPage.authorizeButton).toBeVisible();
    await expect(swaggerDocsPage.authLoginLink).toBeVisible();
    await expect(swaggerDocsPage.serversCombobox).toBeVisible();
  });
});