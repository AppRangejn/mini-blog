import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

if (!DB_NAME || !DB_USER || !DB_PASSWORD) {
  throw new Error('Missing required database environment variables in .env');
}

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST || 'localhost',
  port: Number(DB_PORT) || 5432,
  dialect: 'postgres',
  logging: false,
});
