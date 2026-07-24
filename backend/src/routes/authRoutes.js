const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");

const authController = require("../controllers/authController");

// ==============================================
// Synchronize Firebase User
// ==============================================

router.post(

    "/sync",

    authenticate,

    authController.syncUser

);

module.exports = router;