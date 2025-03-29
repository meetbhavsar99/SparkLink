// models/department.js
// Sequelize model for the 'department' table, representing academic or organizational departments
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Import database connection

// Define the Department model schema
const Department = sequelize.define(
  "Department",
  {
    // Primary key: Unique identifier for each department
    department_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    department_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "department",
    timestamps: false, // No createdAt and updatedAt fields
    charset: "utf8mb4", // Ensures proper encoding in MySQL
    collate: "utf8mb4_unicode_ci",
  }
);

module.exports = Department;
