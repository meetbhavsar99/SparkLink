const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const SystemSettings = sequelize.define(
  "SystemSettings",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    emailService: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "gmail",
    },
    emailUser: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailPass: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    enableNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    maintenanceMode: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { tableName: "t_systemsettings", timestamps: false }
);

module.exports = SystemSettings;
