import {Locator, Page} from '@playwright/test'
export class LoginPage {
  heading: Locator;
  emailInput: Locator;
  passwordInput: Locator;
  signInButton: Locator;
  registerLink: Locator;
  swaggerLink: Locator;
  page: Page;
  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Sign in to EventHub' });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.registerLink = page.getByRole('link', { name: 'Register' });
    this.swaggerLink = page.getByRole('link', { name: 'API Documentation (Swagger)' });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async assertLoaded() {
    await this.heading.waitFor();
  }

  async openRegister() {
    await this.registerLink.click();
  }

  async openSwaggerDocs() {
    const [docsPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.swaggerLink.click(),
    ]);

    await docsPage.waitForLoadState('domcontentloaded');
    return docsPage;
  }
}