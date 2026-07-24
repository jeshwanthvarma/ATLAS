const express = require("express");

const router = express.Router();

// =====================================================
// Import Routes
// =====================================================

const monitoringRoutes = require("./monitoring");

const securityRoutes =
    require("../modules/security/securityRoutes");

// =====================================================
// Root Route
// =====================================================

router.get("/", (req, res) => {

    res.json({
        application: "ATLAS",
        version: "1.0.0",
        status: "Running",
        message: "Welcome to ATLAS"
    });

});

// =====================================================
// Health Check
// =====================================================

router.get("/health", (req, res) => {

    res.json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });

});

// =====================================================
// Monitoring Routes
// =====================================================

router.use("/", monitoringRoutes);

// =====================================================
// Security Routes
// =====================================================

router.use("/security", securityRoutes);

module.exports = router;
