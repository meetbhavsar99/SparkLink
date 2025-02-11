const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Project = require('./project'); // ✅ Import the actual Project model
const User = require('./user'); // ✅ Import the actual User model

const ProjectReport = sequelize.define('ProjectReport', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    proj_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Project, // ✅ Use Sequelize model reference instead of raw table name
            key: 'proj_id'
        },
        onUpdate: 'CASCADE', // ✅ Fixed from "NO ACTION"
        onDelete: 'CASCADE',
    },
    reported_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // ✅ Use Sequelize model reference
            key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    report_count: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reason: {
        type: DataTypes.STRING(250),
        allowNull: false
    }
}, {
    tableName: 't_proj_report',
    timestamps: false,
    charset: "utf8mb4", // ✅ Ensures proper text encoding in MySQL
    collate: "utf8mb4_unicode_ci"
});

module.exports = ProjectReport;
