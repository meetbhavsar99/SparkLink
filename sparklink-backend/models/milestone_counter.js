// Sequelize model to maintain a milestone counter per project.
// Used to assign incremental milestone IDs within each project context.
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Project = require("./project"); // Import the referenced model

const MilestoneCounter = sequelize.define(
  "MilestoneCounter",
  {
    // Primary key for internal reference
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Foreign key referencing the project
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
    milestone_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "t_milestone_counter",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  }
);

module.exports = MilestoneCounter;
