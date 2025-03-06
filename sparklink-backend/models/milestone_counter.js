const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Project = require('./project'); // Import the referenced model

const MilestoneCounter = sequelize.define('MilestoneCounter', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  proj_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Project, // 🔄 Change table name reference to the Sequelize model
      key: 'proj_id'
    },
    onUpdate: 'CASCADE', // 🔄 Change "NO ACTION" to "CASCADE"
    onDelete: 'CASCADE'  // 🔄 Change "NO ACTION" to "CASCADE"
  },
  milestone_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
}, {
  tableName: 't_milestone_counter',
  timestamps: false,
  charset: 'utf8mb4', 
  collate: 'utf8mb4_unicode_ci'
});

module.exports = MilestoneCounter;
