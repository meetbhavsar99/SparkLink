const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require("../models/user"); // Import the actual User model

const OwnerProfile = sequelize.define('OwnerProfile', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: User, // ✅ Use the Sequelize model instead of a raw table name
            key: 'user_id'
        },
        onUpdate: 'CASCADE', // ✅ Ensures updates are reflected in related records
        onDelete: 'CASCADE'  // ✅ Ensures that deleting a user also deletes the profile
    },
    business_type: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    domain_type: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    bio: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    phone_number: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    github: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    linkedin: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
}, {
    tableName: 't_owner_profile',
    timestamps: false,
    charset: 'utf8mb4',  // ✅ Ensures MySQL supports all characters properly
    collate: 'utf8mb4_unicode_ci'
});

module.exports = OwnerProfile;
