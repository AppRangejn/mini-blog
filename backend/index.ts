import 'dotenv/config';
import http from 'http';
import app from './src/app';
import { sequelize } from './src/config/db';
import './src/database/models';

if (!process.env.JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is missing');
}

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

sequelize
  .sync({ alter: true })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database sync error:', err);
  });
