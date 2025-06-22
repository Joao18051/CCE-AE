const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ConversionHistory = sequelize.define('ConversionHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  inputText: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  asciiResult: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  binaryResult: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  codificationResult: {
    type: DataTypes.TEXT, // Store as JSON string
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  updatedAt: false
});

module.exports = ConversionHistory; 