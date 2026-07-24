// ======================================================
// ATLAS API Service
// frontend/js/api.js
// ======================================================

import { auth } from "./firebase.js";

const API_BASE = "/api";

// ======================================================
// Get Firebase Token
// ======================================================

async function getToken() {

    const user = auth.currentUser;

    if (!user) {

        throw new Error(
            "User is not authenticated."
        );

    }

    return await user.getIdToken();

}

// ======================================================
// Generic API Request
// ======================================================

async function apiRequest(endpoint, options = {}) {

    const token = await getToken();

    const response = await fetch(
        `${API_BASE}${endpoint}`,
        {

            ...options,

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`,

                ...(options.headers || {})

            }

        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            data.error ||
            "API Request Failed"
        );

    }

    return data;

}

// ======================================================
// API Methods
// ======================================================

const API = {

    // ==================================================
    // System Information
    // ==================================================

    getSystem() {

        return apiRequest("/system");

    },

    // ==================================================
    // CPU Monitoring
    // ==================================================

    getCPU() {

        return apiRequest("/cpu");

    },

    // ==================================================
    // Memory Monitoring
    // ==================================================

    getMemory() {

        return apiRequest("/memory");

    },

    // ==================================================
    // Disk Monitoring
    // ==================================================

    getDisk() {

        return apiRequest("/disk");

    },

    // ==================================================
    // Network Monitoring
    // ==================================================

    getNetwork() {

        return apiRequest("/network");

    },

    // ==================================================
    // Service Monitoring
    // ==================================================

    getServices() {

        return apiRequest("/services");

    },

    // ==================================================
    // Security Overview
    // ==================================================

    getSecurity() {

        return apiRequest("/security");

    },

    // ==================================================
    // Security - Active Users
    // ==================================================

    getSecurityUsers() {

        return apiRequest("/security/users");

    },

    // ==================================================
    // Security - Login Activity
    // ==================================================

    getSecurityLogins() {

        return apiRequest("/security/logins");

    },

    // ==================================================
    // Security - Firewall
    // ==================================================

    getFirewall() {

        return apiRequest("/security/firewall");

    },

    // ==================================================
    // Authentication / Database User Sync
    // ==================================================

    syncUser() {

        return apiRequest(
            "/auth/sync",
            {
                method: "POST"
            }
        );

    }

};

// ======================================================
// Global API Reference
// ======================================================

window.API = API;

// ======================================================
// Export
// ======================================================

export default API;