const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

// =====================================================
// Execute Linux Command Safely
// =====================================================

async function runCommand(command) {

    try {

        const { stdout } = await execAsync(command);

        return stdout.trim();

    } catch (error) {

        return "";

    }

}

// =====================================================
// Service Security Status
// =====================================================

async function getSecurityServices() {

    const sshStatus =
        await runCommand("systemctl is-active ssh");

    const postgresqlStatus =
        await runCommand("systemctl is-active postgresql");

    return {

        ssh: {
            status: sshStatus || "inactive",
            secure: sshStatus === "active"
        },

        postgresql: {
            status: postgresqlStatus || "unknown",
            running: postgresqlStatus === "active"
        }

    };

}

// =====================================================
// Active User Sessions
// =====================================================

async function getActiveUsers() {

    const output = await runCommand("who");

    if (!output) {

        return [];

    }

    return output
        .split("\n")
        .filter(Boolean)
        .map((line) => {

            const parts =
                line.trim().split(/\s+/);

            return {

                username: parts[0] || "Unknown",

                terminal: parts[1] || "Unknown",

                loginDate: parts[2] || "Unknown",

                loginTime: parts[3] || "Unknown"

            };

        });

}

// =====================================================
// Recent Login Activity
// =====================================================

async function getRecentLogins() {

    const output =
        await runCommand("last -n 5");

    if (!output) {

        return [];

    }

    return output
        .split("\n")
        .filter((line) => {

            return (
                line.trim() &&
                !line.startsWith("wtmp begins")
            );

        })
        .map((line) => {

            return {
                event: line.trim()
            };

        });

}

// =====================================================
// Failed Login Information
// =====================================================

async function getFailedLoginInfo() {

    /*
        Reading /var/log/btmp normally requires
        elevated privileges.

        ATLAS intentionally does not execute sudo
        commands from the web backend.
    */

    const output =
        await runCommand("lastb -n 5 2>/dev/null");

    if (!output) {

        return {

            available: false,

            count: 0,

            events: [],

            message:
                "Failed login log requires elevated permissions."

        };

    }

    const events = output
        .split("\n")
        .filter((line) => {

            return (
                line.trim() &&
                !line.startsWith("btmp begins")
            );

        })
        .map((line) => ({
            event: line.trim()
        }));

    return {

        available: true,

        count: events.length,

        events,

        message: null

    };

}

// =====================================================
// Firewall Information
// =====================================================

async function getFirewallStatus() {

    const ufwLocation =
        await runCommand("command -v ufw");

    if (!ufwLocation) {

        return {

            installed: false,

            status: "Not Installed",

            message:
                "UFW is not installed on this system."

        };

    }

    const status =
        await runCommand("ufw status 2>/dev/null");

    return {

        installed: true,

        status: status || "Permission Required",

        message: status
            ? null
            : "Firewall status requires elevated permissions."

    };

}

// =====================================================
// Complete Security Overview
// =====================================================

async function getSecurityOverview() {

    const [
        services,
        activeUsers,
        recentLogins,
        failedLogins,
        firewall
    ] = await Promise.all([

        getSecurityServices(),

        getActiveUsers(),

        getRecentLogins(),

        getFailedLoginInfo(),

        getFirewallStatus()

    ]);

    return {

        timestamp: new Date().toISOString(),

        hostname: require("os").hostname(),

        services,

        activeUsers,

        activeSessionCount:
            activeUsers.length,

        recentLogins,

        failedLogins,

        firewall

    };

}

// =====================================================
// Exports
// =====================================================

module.exports = {

    getSecurityServices,

    getActiveUsers,

    getRecentLogins,

    getFailedLoginInfo,

    getFirewallStatus,

    getSecurityOverview

};

