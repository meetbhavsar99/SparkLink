// Sequelize model for tracking project applications submitted by users (students or supervisors).
// Stores application status (approved, rejected, pending) and ties each entry to a project, user, and role.
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("../models/user");
const Project = require("../models/project");
const Role = require("../models/role");

const ProjApplication = sequelize.define(
  "ProjApplication",
  {
    // Auto-generated primary key for each application entry
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
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
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
    is_active: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: "Y",
      validate: {
        isIn: [["Y", "N"]],
      },
    },
    is_approved: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: "N",
      validate: {
        isIn: [["Y", "N"]],
      },
    },
    is_rejected: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: "N",
      validate: {
        isIn: [["Y", "N"]],
      },
    },
  },
  {
    tableName: "t_proj_application",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    indexes: [
      {
        name: "t_proj_application_active_unique",
        unique: true,
        fields: ["proj_id", "user_id", "role"],
        where: {
          is_active: "Y",
        },
      },
    ],
  }
);

// Define model associations to connect users and projects with their respective applications
ProjApplication.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "user_id",
  as: "user",
});
User.hasMany(ProjApplication, { foreignKey: "user_id", as: "applications" });

ProjApplication.belongsTo(Project, {
  foreignKey: "proj_id",
  targetKey: "proj_id",
  as: "project",
});
Project.hasMany(ProjApplication, { foreignKey: "proj_id", as: "applications" });

module.exports = ProjApplication;
