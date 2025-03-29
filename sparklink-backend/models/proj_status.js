// Sequelize model for project statuses.
// Stores various status types that a project can have (e.g., Draft, In Progress, Completed).
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Import Sequelize instance

const ProjectStatus = sequelize.define(
  "ProjectStatus",
  {
    // Primary key for each status entry
    status_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status_desc: {
      type: DataTypes.STRING(250),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    tableName: "t_proj_status",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  }
);

module.exports = ProjectStatus;
