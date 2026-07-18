const { pool } = require("../config/database");

async function findUserByEmail(email) {
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    return result.rows[0];
}

module.exports = {
    findUserByEmail
};