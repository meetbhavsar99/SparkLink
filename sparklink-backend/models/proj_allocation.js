// Sequelize model for managing allocations of users (students, supervisors, business owners) to projects.
// Tracks role-based assignments, activity status, and notification preferences for each user-project pair.
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("../models/user");
const Project = require("../models/project");
const Role = require("../models/role");

const ProjAllocation = sequelize.define(
  "ProjAllocation",
  {
    // Auto-incremented primary key for each allocation entry
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Foreign key: associated project
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
    notification: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: "Y",
      validate: {
        isIn: [["Y", "N"]],
      },
    },
    b_notification: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: "Y",
      validate: {
        isIn: [["Y", "N"]],
      },
    },
    s_notification: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: "Y",
      validate: {
        isIn: [["Y", "N"]],
      },
    },
  },
  {
    tableName: "t_proj_allocation",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    indexes: [
      {
        name: "t_proj_allocation_active_unique",
        unique: true,
        fields: ["proj_id", "user_id", "role"],
        where: {
          is_active: "Y",
        },
      },
    ],
  }
);

// Model associations for user, project, and reverse mapping
ProjAllocation.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "user_id",
  as: "user",
});
User.hasMany(ProjAllocation, { foreignKey: "user_id", as: "allocations" });

ProjAllocation.belongsTo(Project, {
  foreignKey: "proj_id",
  targetKey: "proj_id",
  as: "project",
});
Project.hasMany(ProjAllocation, { foreignKey: "proj_id", as: "allocations" });

module.exports = ProjAllocation;
