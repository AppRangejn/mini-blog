import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/db';

interface PostAttributes {
  id: number;
  title: string;
  excerpt?: string | null;
  content: string;
  imageUrl?: string | null;
  authorId: number;
}

interface PostCreationAttributes extends Optional<
  PostAttributes,
  'id' | 'excerpt' | 'imageUrl'
> {}

export class Post
  extends Model<PostAttributes, PostCreationAttributes>
  implements PostAttributes
{
  declare id: number;
  declare title: string;
  declare excerpt: string | null;
  declare content: string;
  declare imageUrl: string | null;
  declare authorId: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    excerpt: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'posts',
  },
);
