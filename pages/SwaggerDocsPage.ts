import {Locator, Page} from '@playwright/test'
export class SwaggerDocsPage {
  heading: Locator;
  authorizeButton: Locator;
  authLoginLink: Locator;
  serversCombobox: Locator;
  page: Page;
  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /EventHub API/i });
    this.authorizeButton = page.getByRole('button', { name: 'Authorize' });
    this.authLoginLink = page.getByRole('link', { name: '/auth/login' });
    this.serversCombobox = page.getByRole('combobox');
  }

  async assertLoaded() {
    await this.heading.waitFor();
  }
}