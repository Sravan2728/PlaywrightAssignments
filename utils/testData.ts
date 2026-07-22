export interface RegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
}

export const sampleRegistration: RegistrationData = {
  email: 'qa.practice.user@example.com',
  password: 'SamplePassword1!',
  confirmPassword: 'SamplePassword1!',
};

export const expectedPasswordRules: string[] = [
  'At least 8 characters',
  'One uppercase letter (A-Z)',
  'One number (0-9)',
  'One special character (!@#$%^&*...)',
];