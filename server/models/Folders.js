module.exports = (sequelize, DataTypes) => {
  const Folder = sequelize.define('Folder', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    category: DataTypes.STRING,
    date: DataTypes.DATEONLY,
    fileName: DataTypes.STRING,
    fileData: DataTypes.BLOB('long')
  });

  return Folder;
};