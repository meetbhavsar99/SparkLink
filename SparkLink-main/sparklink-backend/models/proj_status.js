const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import Sequelize instance

const ProjectStatus = sequelize.define('ProjectStatus', {
  status_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  status_desc: {
    type: DataTypes.STRING(250),
    allowNull: false,
    validate: {
      notEmpty: true // ✅ Prevents empty strings
    }
  }
}, {
  tableName: 't_proj_status',
  timestamps: false,
  charset: 'utf8mb4', // ✅ Ensures proper encoding
  collate: 'utf8mb4_unicode_ci'
});

module.exports = ProjectStatus;
