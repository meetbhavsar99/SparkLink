const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  role_desc: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  is_active: {
    type: DataTypes.CHAR(1), // ✅ Fixed from STRING(2) to CHAR(1) for MySQL
    allowNull: false,
    defaultValue: 'Y',
    validate: {
      isIn: [['Y', 'N']], // ✅ Ensure only 'Y' or 'N' is allowed
    },
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  modified_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_on: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, // ✅ Ensures MySQL default date behavior
  },
  modified_on: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 't_rolesmst',
  timestamps: false,
  charset: 'utf8mb4', // ✅ Ensures proper encoding
  collate: 'utf8mb4_unicode_ci',
});

module.exports = Role;
