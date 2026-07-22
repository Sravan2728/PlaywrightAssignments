import {test as base} from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from'../pages/RegisterPage';
import { sampleRegistration,
  type RegistrationData,
 } from '../utils/testData';
export { expect } from '@playwright/test';
type Fixtures = {
  app: {
    loginPage: LoginPage;
    registerPage: RegisterPage;
  };
  registrationUser: RegistrationData;
};
export const customtest = base.extend<Fixtures>({
  app: async ({ page }, use) => {
    await use({
      loginPage: new LoginPage(page),
      registerPage: new RegisterPage(page),
    });
  },
  registrationUser: async ({}, use) => {
    await use({ ...sampleRegistration });
  },
});