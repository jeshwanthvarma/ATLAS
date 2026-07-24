// =====================================================
// ATLAS Servers Page
// frontend/js/servers.js
// =====================================================

import API from "./api.js";
import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// =====================================================
// Load Server Information
// =====================================================

async function loadServers() {

    if (!auth.currentUser) {
        return;
    }

    try {

        const [
            system,
            services
        ] = await Promise.all([

            API.getSystem(),
            API.getServices()

        ]);

        // =================================================
        // Summary
        // =================================================

        document.getElementById(
            "serverHostname"
        ).textContent =
            system.hostname || "N/A";

        document.getElementById(
            "serverCores"
        ).textContent =
            system.cpuCores ?? "N/A";

        document.getElementById(
            "serverMemory"
        ).textContent =
            system.totalMemory || "N/A";

        document.getElementById(
            "runningServices"
        ).textContent =
            `${services.runningServices}/${services.totalServices}`;

        // =================================================
        // System Details
        // =================================================

        document.getElementById(
            "hostname"
        ).textContent =
            system.hostname || "N/A";

        document.getElementById(
            "platform"
        ).textContent =
            system.platform || "N/A";

        document.getElementById(
            "architecture"
        ).textContent =
            system.architecture || "N/A";

        document.getElementById(
            "cpuModel"
        ).textContent =
            system.cpuModel || "N/A";

        document.getElementById(
            "nodeVersion"
        ).textContent =
            system.nodeVersion || "N/A";

        document.getElementById(
            "uptime"
        ).textContent =
            system.uptime || "N/A";

        // =================================================
        // Service Table
        // =================================================

        const table =
            document.getElementById(
                "servicesTable"
            );

        table.innerHTML = "";

        services.services.forEach(
            (service) => {

                const row =
                    document.createElement("tr");

                const statusClass =
                    service.running
                        ? "status-good"
                        : "status-danger";

                row.innerHTML = `

                    <td>
                        ${service.name}
                    </td>

                    <td>

                        <span class="status ${statusClass}">
                            ${service.status}
                        </span>

                    </td>

                    <td>
                        ${service.cpu}%
                    </td>

                    <td>
                        ${service.memory}%
                    </td>

                `;

                table.appendChild(row);

            }
        );

    } catch (error) {

        console.error(
            "Servers Page Error:",
            error
        );

    }

}

// =====================================================
// Wait For Firebase Authentication
// =====================================================

onAuthStateChanged(
    auth,
    (user) => {

        if (user) {
            loadServers();
        }

    }
);

// =====================================================
// Refresh Every 5 Seconds
// =====================================================

setInterval(() => {

    if (auth.currentUser) {
        loadServers();
    }

}, 5000);
