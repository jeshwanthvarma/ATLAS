const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        application: "ATLAS",
        version: "1.0.0",
        status: "Running",
        message: "Welcome to ATLAS"
    });
});

router.get("/health", (req, res) => {
    res.json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

module.exports = router;