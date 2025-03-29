// Sequelize model for reporting a project.
// Used to track reports filed by users against specific projects, along with reasons and report counts.
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Project = require("./project");
const User = require("./user");

const ProjectReport = sequelize.define(
  "ProjectReport",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    proj_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Project,
        key: "proj_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    reported_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    report_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
  },
  {
    tableName: "t_proj_report",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  }
);

module.exports = ProjectReport;
