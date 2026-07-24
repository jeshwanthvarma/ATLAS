// =====================================================
// ATLAS Security Page
// frontend/js/security.js
// =====================================================

import API from "./api.js";
import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// =====================================================
// Safe Element Update
// =====================================================

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent =
            value ?? "N/A";
    }

}

// =====================================================
// Load Security Information
// =====================================================

async function loadSecurity() {

    if (!auth.currentUser) {
        return;
    }

    try {

        const security =
            await API.getSecurity();

        // =================================================
        // Summary
        // =================================================

        setText(
            "activeSessions",
            security.activeSessionCount ?? 0
        );

        setText(
            "postgresStatus",
            security.services?.postgresql?.status ||
            "Unknown"
        );

        setText(
            "sshStatus",
            security.services?.ssh?.status ||
            "Unknown"
        );

        setText(
            "firewallStatus",
            security.firewall?.status ||
            "Unknown"
        );

        // =================================================
        // Security Details
        // =================================================

        setText(
            "securityHostname",
            security.hostname || "N/A"
        );

        setText(
            "postgresDetail",
            security.services?.postgresql?.status ||
            "Unknown"
        );

        setText(
            "sshDetail",
            security.services?.ssh?.status ||
            "Unknown"
        );

        setText(
            "firewallDetail",
            security.firewall?.status ||
            "Unknown"
        );

        if (security.failedLogins) {

            if (security.failedLogins.available) {

                setText(
                    "failedLoginStatus",
                    `${security.failedLogins.count} failed login attempt(s)`
                );

            } else {

                setText(
                    "failedLoginStatus",
                    security.failedLogins.message ||
                    "Unavailable"
                );

            }

        }

        // =================================================
        // Active Users
        // =================================================

        const usersTable =
            document.getElementById(
                "activeUsersTable"
            );

        if (usersTable) {

            usersTable.innerHTML = "";

            if (
                !security.activeUsers ||
                security.activeUsers.length === 0
            ) {

                usersTable.innerHTML = `
                    <tr>
                        <td colspan="4">
                            No active sessions
                        </td>
                    </tr>
                `;

            } else {

                security.activeUsers.forEach(
                    (user) => {

                        const row =
                            document.createElement(
                                "tr"
                            );

                        row.innerHTML = `

                            <td>
                                ${user.username}
                            </td>

                            <td>
                                ${user.terminal}
                            </td>

                            <td>
                                ${user.loginDate}
                            </td>

                            <td>
                                ${user.loginTime}
                            </td>

                        `;

                        usersTable.appendChild(
                            row
                        );

                    }
                );

            }

        }

        // =================================================
        // Recent Login Activity
        // =================================================

        const activity =
            document.getElementById(
                "loginActivity"
            );

        if (activity) {

            activity.innerHTML = "";

            if (
                !security.recentLogins ||
                security.recentLogins.length === 0
            ) {

                const item =
                    document.createElement("li");

                item.textContent =
                    "No recent login activity available.";

                activity.appendChild(item);

            } else {

                security.recentLogins.forEach(
                    (login) => {

                        const item =
                            document.createElement(
                                "li"
                            );

                        item.textContent =
                            login.event;

                        activity.appendChild(
                            item
                        );

                    }
                );

            }

        }

    } catch (error) {

        console.error(
            "Security Page Error:",
            error
        );

    }

}

// =====================================================
// Authentication
// =====================================================

onAuthStateChanged(
    auth,
    (user) => {

        if (user) {
            loadSecurity();
        }

    }
);

// =====================================================
// Automatic Refresh
// =====================================================

setInterval(() => {

    if (auth.currentUser) {
        loadSecurity();
    }

}, 10000);
