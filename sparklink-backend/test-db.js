const { Client } = require("pg");

const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:Sp@rklink01@localhost:5432/sparklinkdb",
});

client
  .connect()
  .then(() => console.log("✅ Connected to PostgreSQL successfully!"))
  .catch((err) => console.error("❌ Database connection failed:", err))
  .finally(() => client.end());
