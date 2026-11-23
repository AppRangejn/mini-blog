import 'dotenv/config';
import { sequelize } from '../config/db';
import { seedPosts } from './posts.seeder';
import { seedUsers } from './users.seeder';

const runSeeders = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const admin = await seedUsers();
    await seedPosts(admin.id);

    console.log('All seeders completed successfully.');
  } finally {
    await sequelize.close();
  }
};

runSeeders().catch((err: unknown) => {
  console.error('Seeding failed:', err);
  process.exitCode = 1;
});
