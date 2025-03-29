// Sequelize model for project milestones.
// Each milestone is linked to a project and includes title, description, deadline, and completion status.
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Project = require("./project");

const ProjectMilestone = sequelize.define(
  "ProjectMilestone",
  {
    proj_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Project,
        key: "proj_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    milestone_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    milestone_desc: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    is_completed: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: "N",
      validate: {
        isIn: [["Y", "N"]],
      },
    },
    milestone_title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: "Y",
      validate: {
        isIn: [["Y", "N"]],
      },
    },
  },
  {
    tableName: "t_proj_milestone",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  }
);

module.exports = ProjectMilestone;
