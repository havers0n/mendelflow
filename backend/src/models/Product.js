const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
  },
  dimensions: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  weight: {
    type: DataTypes.FLOAT,
  },
  unit: {
    type: DataTypes.STRING,
    defaultValue: 'kg',
  },
  location: {
    type: DataTypes.JSONB,
    defaultValue: {
      zone: '',
      shelf: '',
      position: '',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  modelUrl: {
    type: DataTypes.STRING,
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
});

module.exports = Product; 