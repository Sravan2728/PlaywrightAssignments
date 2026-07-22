import {Locator, Page} from '@playwright/test'
import { RegistrationData } from '../utils/testData'; 
export class RegisterPage {
  heading: Locator;
  emailInput: Locator;
  passwordInput: Locator;
  confirmPasswordInput: Locator;
  passwordRules: Locator;
  createAccountButton: Locator;
  signInLink: Locator;
  page: Page;
  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Create your account' });
    this.emailInput = page.getByRole('textbox', { name: 'you@email.com' });
    this.passwordInput = page.getByRole('textbox', {
      name: 'Min 8 chars, uppercase, number & symbol',
    });
    this.confirmPasswordInput = page.getByRole('textbox', { name: 'Repeat your password' });
    this.passwordRules = page.locator('li');
    this.createAccountButton = page.getByRole('button', { name: 'Create Account' });
    this.signInLink = page.getByRole('link', { name: 'Sign in' });
  }

  async goto() {
    await this.page.goto('/register');
  }

  async assertLoaded() {
    await this.heading.waitFor();
  }

  async getPasswordRules() {
    return this.passwordRules.allInnerTexts();
  }

  async fillRegistrationForm(user: RegistrationData): Promise<void>{
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.confirmPasswordInput.fill(user.confirmPassword);
  }

  async goToSignIn() {
    await this.signInLink.click();
  }
}