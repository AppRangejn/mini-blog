import bcrypt from 'bcrypt';
import { AUTH_CONFIG, ROLES } from '../constants';
import { User } from '../database/models/User';

export const seedUsers = async (): Promise<User> => {
  const adminEmail =
    process.env.ADMIN_EMAIL?.trim().toLowerCase() || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'password123';

  const [adminHash, userHash] = await Promise.all([
    bcrypt.hash(adminPassword, AUTH_CONFIG.SALT_ROUNDS),
    bcrypt.hash('User1234!', AUTH_CONFIG.SALT_ROUNDS),
  ]);

  const usersData = [
    {
      name: process.env.ADMIN_NAME?.trim() || 'Admin',
      email: adminEmail,
      password: adminHash,
      role: ROLES.ADMIN,
    },
    {
      name: 'Alex Morgan',
      email: 'alex@example.com',
      password: userHash,
      role: ROLES.USER,
    },
    {
      name: 'Elena Vance',
      email: 'elena@example.com',
      password: userHash,
      role: ROLES.USER,
    },
  ];

  const createdUsers: User[] = [];
  for (const userData of usersData) {
    const [user] = await User.upsert(userData, { returning: true });
    createdUsers.push(user);
  }

  console.log(`Seeded ${createdUsers.length} users (admin: ${adminEmail})`);
  return createdUsers[0];
};
