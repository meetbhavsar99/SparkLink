const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ContactRequest = sequelize.define('ContactRequest', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    tokenId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Pending'
    }
});

module.exports = ContactRequest;
