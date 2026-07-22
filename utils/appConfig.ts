export interface AppConfig {
  baseUrl: string;
  apiDocsUrl: string;
}

export const appConfig: AppConfig = {
  baseUrl: process.env.BASE_URL || 'https://eventhub.rahulshettyacademy.com',
  apiDocsUrl: 'https://api.eventhub.rahulshettyacademy.com/api/docs/',
};
