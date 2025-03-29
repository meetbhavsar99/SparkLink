// Sequelize model for 'student_group_members' table, linking students to their respective groups
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Define the GroupMember model schema
const GroupMember = sequelize.define(
  "GroupMember",
  {
    // Auto-incremented primary key
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Group ID to which the student belongs
    group_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "student_group_members",
  }
);

// Define associations between GroupMember and related models
GroupMember.associate = (models) => {
  GroupMember.belongsTo(models.Group, {
    foreignKey: "group_id",
    as: "group",
  });
  GroupMember.belongsTo(models.User, {
    foreignKey: "user_id",
    as: "user",
  });
};

module.exports = GroupMember;
