import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  PORT: process.env.PORT || '5000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'vhealth_default_secret_key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  AI_SERVICE_URL: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL || 'https://our-interim-tax-pickup.trycloudflare.com',
  TEST_EMERGENCY_NOTIFICATION: process.env.TEST_EMERGENCY_NOTIFICATION || 'true',
  TEST_NOTIFICATION_RECIPIENT_PHONE: process.env.TEST_NOTIFICATION_RECIPIENT_PHONE || '+919988776655',
  TEST_NOTIFICATION_RECIPIENT_FCM: process.env.TEST_NOTIFICATION_RECIPIENT_FCM || 'fcm_token_device_demo_101',
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || '',
  FCM_SERVER_KEY: process.env.FCM_SERVER_KEY || '',
};
