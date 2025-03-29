// Sequelize model representing users in the system.
// Includes authentication fields (hashed password, verification flags, reset token), role associations,
// and lifecycle hooks for secure password handling using bcrypt.
const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config/db");
const Role = require("./role");

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    confirmation_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "t_rolesmst",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(250),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: "Y",
      validate: {
        isIn: [["Y", "N"]], // only 'Y' or 'N' is allowed
      },
    },
    is_verified: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: "N",
      validate: {
        isIn: [["Y", "N"]],
      },
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    modified_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    resetpasswordtoken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetpasswordexpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "t_usermst",
    timestamps: false, // Change to true if you want automatic timestamps
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          // Only hash if password is changing
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

// Method to validate password
User.prototype.validPassword = async function (password) {
  console.log(password + "Hashed password:" + this.password);
  return await bcrypt.compare(password, this.password);
};

User.belongsTo(Role, { foreignKey: "role", as: "roleDetails" });

module.exports = User;
