import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const env = {
  PORT: process.env.PORT || 3000,
  API_VERSION: process.env.API_VERSION || 'v1',
  NODE_ENV: process.env.NODE_ENV || 'development',
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASS: process.env.EMAIL_PASS || '',
  PROJECT_NAME: process.env.PROJECT_NAME || 'gestionMedicaBack',
};
