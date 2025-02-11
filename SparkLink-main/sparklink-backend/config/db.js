require('dotenv').config();
const { Sequelize } = require('sequelize');

// Initialize Sequelize with database credentials
const sequelize = new Sequelize("sparklinkdb", "sparklinkuser", "sparklink123", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
  dialectOptions: {
    ssl: process.env.DATABASE_URL.includes("localhost") ? false : { require: true, rejectUnauthorized: false },
  },
  pool: {
    max: 5,        // Maximum number of connections in pool
    min: 0,        // Minimum number of connections in pool
    acquire: 30000, // Maximum time (ms) pool will try to get connection
    idle: 10000,   // Maximum time (ms) connection can be idle before release
  },
});

// Test the connection
sequelize.authenticate()
  .then(() => console.log('✅ Database connected successfully!'))
  .catch(err => console.error('❌ Database connection error:', err));

module.exports = sequelize;
