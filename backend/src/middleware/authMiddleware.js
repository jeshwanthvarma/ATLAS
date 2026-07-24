// ======================================================
// ATLAS Authentication Middleware
// Firebase Token Verification
// ======================================================

const firebase = require("../config/firebase");

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization header missing",
            });
        }

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format",
            });
        }

        const idToken = authHeader.replace("Bearer ", "");

        const decodedToken = await firebase.auth.verifyIdToken(idToken);

        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            name: decodedToken.name || "",
            picture: decodedToken.picture || "",
        };

        next();
    } catch (error) {
        console.error("Firebase Authentication Error:", error);

        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
};

module.exports = authenticate;