const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("../models/user");
const Project = require("../models/project");
const Role = require("../models/role"); // ✅ Added Role model reference

const ProjAllocation = sequelize.define(
  "ProjAllocation",
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
        model: Project, // ✅ Use Sequelize model reference
        key: "proj_id",
      },
      onUpdate: "CASCADE", // ✅ Fixed from "NO ACTION"
      onDelete: "CASCADE",
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User, // ✅ Use Sequelize model reference
        key: "user_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role, // ✅ Use Sequelize model reference
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
      defaultValue: DataTypes.NOW, // ✅ Ensures correct timestamp behavior in MySQL
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    modified_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // ✅ Fixed for MySQL
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
    charset: "utf8mb4", // ✅ Added for compatibility
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

// 🟢 Define Associations
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
