const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

async function connectDatabase() {
    try {
        const client = await pool.connect();

        console.log("=======================================");
        console.log("✅ PostgreSQL Connected Successfully");
        console.log(`📂 Database : ${process.env.DB_NAME}`);
        console.log("=======================================");

        client.release();
    } catch (error) {
        console.error("❌ Database Connection Failed");
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = {
    pool,
    connectDatabase,
};