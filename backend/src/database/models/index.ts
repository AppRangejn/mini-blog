import { Post } from './Post';
import { User } from './User';

User.hasMany(Post, {
  foreignKey: 'authorId',
  as: 'posts',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

export { Post, User };
