// ======================================================
// ATLAS Configuration
// Single source of truth
// ======================================================

const CONFIG = {

    APP_NAME: "ATLAS",
    VERSION: "1.0.0",

    API_BASE: "/api",

    REFRESH_INTERVAL: 5000,

    MAX_HISTORY_POINTS: 30,

    DEV_MODE: false,

    USE_MOCK_DATA: false,

    ROUTES: {
        LOGIN: "/login.html",
        DASHBOARD: "/dashboard.html",
        LOGOUT: "/login.html"
    },

    STORAGE: {
        TOKEN: "atlas_token",
        USER: "atlas_user",
        THEME: "atlas_theme"
    },

    ENDPOINTS: {
        SYSTEM: "/system",
        CPU: "/cpu",
        MEMORY: "/memory",
        DISK: "/disk",
        NETWORK: "/network",
        LOGS: "/logs",
        PROCESSES: "/processes",
        ALERTS: "/alerts",
        LOGIN: "/login",
        LOGOUT: "/logout"
    }

};

Object.freeze(CONFIG);