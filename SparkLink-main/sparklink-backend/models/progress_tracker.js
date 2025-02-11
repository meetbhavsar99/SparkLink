const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const ProjectMilestone = require('./proj_milestone'); // ✅ Import the actual model

const ProgressTracker = sequelize.define('ProgressTracker', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ProjectMilestone, // ✅ Use the Sequelize model instead of a raw table name
            key: 'proj_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    milestone_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ProjectMilestone, // ✅ Use the model reference instead
            key: 'milestone_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    supervisor_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    project_owner: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_on: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    modified_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    modified_on: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
}, {
    tableName: 't_progress_tracker',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
});

module.exports = ProgressTracker;
