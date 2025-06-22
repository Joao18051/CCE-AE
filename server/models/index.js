const User = require('./User');
const Folder = require('./Folders');
const Text = require('./Text');
const ConversionHistory = require('./ConversionHistory');

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

User.hasMany(ConversionHistory, {
  foreignKey: 'userId',
  as: 'conversionHistories',
  onDelete: 'CASCADE'
});

ConversionHistory.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

module.exports = {
  User,
  Folder,
  Text,
  ConversionHistory
}; 