const User = require('./User');
const Folder = require('./Folders');
const Text = require('./Text');

// Define associations
User.hasMany(Folder, {
  foreignKey: 'userId',
  as: 'folders',
  onDelete: 'CASCADE'
});

Folder.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

User.hasMany(Text, {
  foreignKey: 'userId',
  as: 'texts',
  onDelete: 'CASCADE'
});

Text.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

module.exports = {
  User,
  Folder,
  Text
}; 