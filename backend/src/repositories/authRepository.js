const { pool } = require("../config/database");

// ======================================================
// Find User by Email
// ======================================================

async function findUserByEmail(email) {
    const result = await pool.query(
        `
        SELECT
            u.*,
            r.role_name
        FROM users u
        JOIN roles r
            ON u.role_id = r.role_id
        WHERE u.email = $1
        `,
        [email]
    );

    return result.rows[0];
}

// ======================================================
// Create Firebase User
// ======================================================

async function createFirebaseUser(user) {

    const roleResult = await pool.query(
        `
        SELECT role_id
        FROM roles
        WHERE role_name = 'Viewer'
        LIMIT 1
        `
    );

    if (roleResult.rows.length === 0) {
        throw new Error("Viewer role not found.");
    }

    const roleId = roleResult.rows[0].role_id;

    const result = await pool.query(
        `
        INSERT INTO users
        (
            role_id,
            firebase_uid,
            first_name,
            last_name,
            username,
            email,
            password_hash,
            auth_provider,
            last_login
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            NOW()
        )
        RETURNING
            user_id,
            role_id,
            firebase_uid,
            first_name,
            last_name,
            username,
            email,
            auth_provider,
            last_login
        `,
        [
            roleId,
            user.firebase_uid,
            user.first_name,
            user.last_name,
            user.username,
            user.email,
            "",
            user.auth_provider || "firebase"
        ]
    );

    return result.rows[0];
}

// ======================================================
// Update Last Login
// ======================================================

async function updateLastLogin(userId) {

    await pool.query(
        `
        UPDATE users
        SET last_login = NOW()
        WHERE user_id = $1
        `,
        [userId]
    );

}

module.exports = {
    findUserByEmail,
    createFirebaseUser,
    updateLastLogin
};