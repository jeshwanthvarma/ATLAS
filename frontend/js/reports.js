// =====================================================
// ATLAS Reports Page
// frontend/js/reports.js
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
// Load Report
// =====================================================

async function loadReport() {

    if (!auth.currentUser) {
        return;
    }

    try {

        const [
            system,
            cpu,
            memory,
            disk,
            network,
            services,
            security
        ] = await Promise.all([

            API.getSystem(),
            API.getCPU(),
            API.getMemory(),
            API.getDisk(),
            API.getNetwork(),
            API.getServices(),
            API.getSecurity()

        ]);

        // =================================================
        // Summary
        // =================================================

        setText(
            "reportCpu",
            `${cpu.usage ?? 0}%`
        );

        setText(
            "reportMemory",
            `${memory.usagePercent ?? 0}%`
        );

        setText(
            "reportDisk",
            `${disk.usage ?? 0}%`
        );

        setText(
            "reportServices",
            `${services.runningServices}/${services.totalServices}`
        );

        // =================================================
        // System Report
        // =================================================

        setText(
            "reportHostname",
            system.hostname
        );

        setText(
            "reportPlatform",
            system.platform
        );

        setText(
            "reportArchitecture",
            system.architecture
        );

        setText(
            "reportCpuModel",
            system.cpuModel
        );

        setText(
            "reportCores",
            system.cpuCores
        );

        setText(
            "reportTotalMemory",
            system.totalMemory
        );

        setText(
            "reportUptime",
            system.uptime
        );

        // =================================================
        // Security Report
        // =================================================

        setText(
            "reportSessions",
            security.activeSessionCount ?? 0
        );

        setText(
            "reportPostgres",
            security.services?.postgresql?.status ||
            "Unknown"
        );

        setText(
            "reportSSH",
            security.services?.ssh?.status ||
            "Unknown"
        );

        setText(
            "reportFirewall",
            security.firewall?.status ||
            "Unknown"
        );

        if (security.failedLogins?.available) {

            setText(
                "reportFailedLogins",
                `${security.failedLogins.count} detected`
            );

        } else {

            setText(
                "reportFailedLogins",
                "Unavailable - permission required"
            );

        }

        // =================================================
        // Network
        // =================================================

        setText(
            "reportNetwork",
            network.interface ||
            "Unavailable"
        );

        setText(
            "reportIP",
            network.ipAddress ||
            "Unavailable"
        );

        // =================================================
        // Service Report
        // =================================================

        const table =
            document.getElementById(
                "reportServicesTable"
            );

        if (table) {

            table.innerHTML = "";

            if (
                !Array.isArray(services.services) ||
                services.services.length === 0
            ) {

                table.innerHTML = `

                    <tr>
                        <td colspan="4">
                            No service information available
                        </td>
                    </tr>

                `;

            } else {

                services.services.forEach(
                    (service) => {

                        const row =
                            document.createElement(
                                "tr"
                            );

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

            }

        }

        // =================================================
        // Report Metadata
        // =================================================

        setText(
            "reportGenerated",
            new Date().toLocaleString()
        );

    } catch (error) {

        console.error(
            "Reports Page Error:",
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
            loadReport();
        }

    }
);

// =====================================================
// Refresh Report Every 10 Seconds
// =====================================================

setInterval(() => {

    if (auth.currentUser) {
        loadReport();
    }

}, 10000);
