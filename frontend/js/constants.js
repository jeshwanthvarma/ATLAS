// ======================================================
// ATLAS Constants
// ======================================================

const CONSTANTS = {

    STATUS: {
        HEALTHY: "healthy",
        WARNING: "warning",
        CRITICAL: "critical",
        UNKNOWN: "unknown"
    },

    STATUS_CLASS: {

        healthy: "status-on",
        running: "status-on",
        up: "status-on",

        warning: "status-warn",
        degraded: "status-warn",

        critical: "status-off",
        stopped: "status-off",
        down: "status-off",
        error: "status-off",
        unknown: "status-off"
    },

    SEVERITY_CLASS: {

        info: "status-on",
        warning: "status-warn",
        critical: "status-off"

    },

    DEFAULTS: {

        CPU: {
            usage: 0,
            trend: 0
        },

        MEMORY: {
            used: 0,
            total: 16384,
            free: 0,
            cache: 0,
            swap: 0
        },

        DISK: {
            usage: 0,
            read: 0,
            write: 0,
            trend: 0
        },

        NETWORK: {
            speed: 0,
            in: 0,
            out: 0
        },

        SYSTEM: {
            hostname: "unknown",
            uptime: 0
        },

        LOGS: [],

        ALERTS: {
            total: 0,
            critical: 0,
            list: []
        }

    }

};

Object.freeze(CONSTANTS);