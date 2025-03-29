// Sequelize model for 'student_groups' table, representing student project groups
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Define the Group model schema
const Group = sequelize.define(
  "Group",
  {
    // Unique group identifier (string-based)
    group_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    // User ID of the team leader (must be a valid student user)
    team_leader_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    resume_pdf: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "student_groups",
  }
);

// Define association: A group can have many members
Group.associate = (models) => {
  Group.hasMany(models.GroupMember, {
    foreignKey: "group_id",
    as: "members",
  });
};

module.exports = Group;
