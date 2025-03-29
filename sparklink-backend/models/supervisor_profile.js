// Sequelize model for storing detailed supervisor profile information.
// Includes department, domain expertise, bio, social links, and verification flags.
// Linked to the main User model via user_id.
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("../models/user");

const SupervisorProfile = sequelize.define(
  "SupervisorProfile",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    department: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    domain: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_project_owner: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    bio: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    expertise: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    education: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    experience: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    phone_number: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    github: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    linkedin: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    course: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "t_supervisor_profile",
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  }
);

module.exports = SupervisorProfile;
