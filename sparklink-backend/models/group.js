const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Group = sequelize.define("Group", {
  group_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
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
}, {
  tableName: 'student_groups',
});

// ✅ Attach the associate method to the model
Group.associate = (models) => {
  Group.hasMany(models.GroupMember, {
    foreignKey: "group_id",
    as: "members",
  });
};

module.exports = Group;
