// =====================================================
// ATLAS Settings Page
// frontend/js/settings.js
// =====================================================

import API from "./api.js";
import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent =
            value ?? "N/A";
    }

}

// =====================================================
// Authentication Information
// =====================================================

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {
            return;
        }

        setText(
            "settingsName",
            user.displayName || "ATLAS User"
        );

        setText(
            "settingsEmail",
            user.email || "N/A"
        );

        setText(
            "emailVerified",
            user.emailVerified
                ? "Yes"
                : "No"
        );

        const provider =
            user.providerData?.[0]?.providerId ||
            "Unknown";

        setText(
            "authProvider",
            provider
        );

        // =============================================
        // Real System Information
        // =============================================

        try {

            const system =
                await API.getSystem();

            setText(
                "settingsHostname",
                system.hostname
            );

            setText(
                "settingsPlatform",
                system.platform
            );

            setText(
                "settingsArchitecture",
                system.architecture
            );

            setText(
                "settingsNode",
                system.nodeVersion
            );

        } catch (error) {

            console.error(
                "Settings Page Error:",
                error
            );

        }

    }
);
