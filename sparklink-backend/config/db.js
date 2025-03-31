require("dotenv").config();
const { Sequelize } = require("sequelize");

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Check your .env file.");
  process.exit(1);
}

// Create a Sequelize instance
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  logging: false,
  dialectOptions: {
    ssl: process.env.DATABASE_URL.includes("localhost")
      ? false
      : { require: true, rejectUnauthorized: false },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Test the connection
sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully!"))
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });

module.exports = sequelize; // Export only `sequelize`
