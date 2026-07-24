const express = require("express");

const router = express.Router();

const securityController =
    require("./securityController");

// =====================================================
// ATLAS Security Routes
// =====================================================

router.get(
    "/",
    securityController.getSecurityOverview
);

router.get(
    "/users",
    securityController.getActiveUsers
);

router.get(
    "/logins",
    securityController.getRecentLogins
);

router.get(
    "/firewall",
    securityController.getFirewall
);

module.exports = router;
