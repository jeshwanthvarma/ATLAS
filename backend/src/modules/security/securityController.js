const securityService = require("./securityService");

// =====================================================
// Security Overview
// =====================================================

exports.getSecurityOverview = async (req, res) => {

    try {

        const data =
            await securityService.getSecurityOverview();

        res.status(200).json(data);

    } catch (error) {

        console.error(
            "Security Overview Error:",
            error
        );

        res.status(500).json({
            error: "Failed to retrieve security information."
        });

    }

};

// =====================================================
// Active Users
// =====================================================

exports.getActiveUsers = async (req, res) => {

    try {

        const data =
            await securityService.getActiveUsers();

        res.status(200).json(data);

    } catch (error) {

        console.error(
            "Active Users Error:",
            error
        );

        res.status(500).json({
            error: "Failed to retrieve active users."
        });

    }

};

// =====================================================
// Recent Logins
// =====================================================

exports.getRecentLogins = async (req, res) => {

    try {

        const data =
            await securityService.getRecentLogins();

        res.status(200).json(data);

    } catch (error) {

        console.error(
            "Recent Logins Error:",
            error
        );

        res.status(500).json({
            error: "Failed to retrieve login activity."
        });

    }

};

// =====================================================
// Firewall
// =====================================================

exports.getFirewall = async (req, res) => {

    try {

        const data =
            await securityService.getFirewallStatus();

        res.status(200).json(data);

    } catch (error) {

        console.error(
            "Firewall Error:",
            error
        );

        res.status(500).json({
            error: "Failed to retrieve firewall information."
        });

    }

};

