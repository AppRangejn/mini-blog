import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/db';

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

interface UserCreationAttributes extends Optional<
  UserAttributes,
  'id' | 'role'
> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare role: 'user' | 'admin';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user',
    },
  },
  { sequelize, tableName: 'users' },
);
