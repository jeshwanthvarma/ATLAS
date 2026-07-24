const authService = require("../services/authService");

// ======================================================
// Sync Logged-in Firebase User
// ======================================================

async function syncUser(req, res) {

    try {

        const user = await authService.syncFirebaseUser(
            req.user
        );

        res.json({

            success: true,

            message: "User synchronized successfully",

            data: user

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

module.exports = {

    syncUser

};