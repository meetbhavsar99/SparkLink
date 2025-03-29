// Sequelize model for tracking milestone-level progress of projects.
// Each entry logs progress details assigned by a supervisor or project owner.
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const ProjectMilestone = require("./proj_milestone");

const ProgressTracker = sequelize.define(
  "ProgressTracker",
  {
    // Primary key for progress tracking entries
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Associated project ID (foreign key from proj_milestone)
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ProjectMilestone,
        key: "proj_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    milestone_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ProjectMilestone,
        key: "milestone_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    supervisor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    project_owner: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    modified_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "t_progress_tracker",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  }
);

module.exports = ProgressTracker;
