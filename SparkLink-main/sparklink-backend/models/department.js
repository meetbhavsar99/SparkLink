// models/department.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection

const Department = sequelize.define('Department', {
  department_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  department_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  tableName: 'department',
  timestamps: false,  // No createdAt and updatedAt fields
  charset: 'utf8mb4', // Ensures proper encoding in MySQL
  collate: 'utf8mb4_unicode_ci'
});

module.exports = Department;
