const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const GroupMember = sequelize.define("GroupMember", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  group_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'student_group_members',
});

// ✅ Attach the associate method to the model
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
