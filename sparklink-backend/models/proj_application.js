const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("../models/user");
const Project = require("../models/project");
const Role = require("../models/role"); // ✅ Added Role model reference

const ProjApplication = sequelize.define(
  "ProjApplication",
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
        model: Project, // ✅ Use Sequelize model reference instead of raw table name
        key: "proj_id",
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
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // ✅ Fixed default value for MySQL
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    modified_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // ✅ Fixed default value for MySQL
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
    charset: "utf8mb4", // ✅ Added for compatibility
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

// 🟢 Define Associations
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
