const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Import your database connection

const Log = sequelize.define("Log", {
  log_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true, 
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  log_type: {
    type: DataTypes.ENUM("user", "action", "error"),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,  // ✅ Auto-fills timestamp
  },
}, {
  timestamps: false,  // ✅ Prevent Sequelize from adding `createdAt/updatedAt`
});

// Sync model with database (Only for first-time setup)
(async () => {
    await sequelize.sync();
    console.log("✅ Log table created (if it didn't exist)");
})();

module.exports = Log;
