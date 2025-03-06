const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Analytics = sequelize.define(
  "Analytics",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    totalUsers: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    activeUsers: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    inactiveUsers: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalProjects: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    completedProjects: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ongoingProjects: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "t_analytics",
    timestamps: true,
  }
);

module.exports = Analytics;
