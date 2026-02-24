import { config } from 'dotenv';

// Load the correct .env file based on NODE_ENV
// e.g. if NODE_ENV=development → loads .env.development.local
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const {
  PORT,
  NODE_ENV,
  DB_URI,
  JWT_SECRET,
  JWT_EXPIRE_IN,
  ARCJET_ENV,
  ARCJET_KEY,
  EMAIL_PASSWORD,
  EMAIL_USER
} = process.env;