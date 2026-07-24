// =====================================================
// ATLAS Alerts Page
// frontend/js/alerts.js
// =====================================================

import API from "./api.js";
import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

function setText(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.textContent = value ?? "N/A";
    }

}

function statusBadge(text, type) {

    return `
        <span class="status ${type}">
            ${text}
        </span>
    `;

}

// =====================================================
// Load Alerts
// =====================================================

async function loadAlerts() {

    if (!auth.currentUser) {
        return;
    }

    try {

        const [
            cpu,
            memory,
            disk,
            services,
            security
        ] = await Promise.all([

            API.getCPU(),
            API.getMemory(),
            API.getDisk(),
            API.getServices(),
            API.getSecurity()

        ]);

        const alerts = [];

        const cpuUsage =
            parseFloat(cpu.usage) || 0;

        const memoryUsage =
            parseFloat(memory.usagePercent) || 0;

        const diskUsage =
            parseFloat(disk.usage) || 0;

        // =================================================
        // CPU Alert
        // =================================================

        if (cpuUsage >= 90) {

            alerts.push({
                severity: "Critical",
                source: "CPU",
                message:
                    `CPU usage reached ${cpu.usage}%`
            });

        }

        // =================================================
        // Memory Alert
        // =================================================

        if (memoryUsage >= 90) {

            alerts.push({
                severity: "Critical",
                source: "Memory",
                message:
                    `Memory usage reached ${memory.usagePercent}%`
            });

        }

        // =================================================
        // Disk Alert
        // =================================================

        if (diskUsage >= 90) {

            alerts.push({
                severity: "Critical",
                source: "Disk",
                message:
                    `Disk usage reached ${disk.usage}%`
            });

        }

        // =================================================
        // PostgreSQL Alert
        // =================================================

        if (
            security.services?.postgresql &&
            !security.services.postgresql.running
        ) {

            alerts.push({
                severity: "Critical",
                source: "PostgreSQL",
                message:
                    "PostgreSQL service is not running"
            });

        }

        // =================================================
        // Firewall Alert
        // =================================================

        if (
            security.firewall &&
            !security.firewall.installed
        ) {

            alerts.push({
                severity: "Warning",
                source: "Security",
                message:
                    "UFW firewall is not installed"
            });

        }

        // =================================================
        // Failed Login Alert
        // =================================================

        if (
            security.failedLogins?.available &&
            security.failedLogins.count > 0
        ) {

            alerts.push({
                severity: "Warning",
                source: "Authentication",
                message:
                    `${security.failedLogins.count} failed login attempt(s) detected`
            });

        }

        // =================================================
        // Service Alerts
        // =================================================

        if (Array.isArray(services.services)) {

            services.services.forEach(
                (service) => {

                    /*
                     PostgreSQL is required by ATLAS.
                     Other monitored services may legitimately
                     be stopped/not installed, so they are not
                     automatically treated as critical alerts.
                    */

                    if (
                        service.name === "postgresql" &&
                        !service.running &&
                        !alerts.some(
                            (alert) =>
                                alert.source === "PostgreSQL"
                        )
                    ) {

                        alerts.push({
                            severity: "Critical",
                            source: "Service",
                            message:
                                "PostgreSQL service is unavailable"
                        });

                    }

                }
            );

        }

        // =================================================
        // Summary Cards
        // =================================================

        setText(
            "activeAlertCount",
            alerts.length
        );

        setText(
            "cpuAlertStatus",
            cpuUsage >= 90
                ? "Critical"
                : "Normal"
        );

        setText(
            "memoryAlertStatus",
            memoryUsage >= 90
                ? "Critical"
                : "Normal"
        );

        const securityProblems =
            alerts.filter(
                (alert) =>
                    alert.source === "Security" ||
                    alert.source === "Authentication"
            ).length;

        setText(
            "securityAlertStatus",
            securityProblems > 0
                ? "Attention"
                : "Normal"
        );

        // =================================================
        // Current Conditions
        // =================================================

        setText(
            "cpuCurrent",
            `${cpu.usage}%`
        );

        document.getElementById(
            "cpuCondition"
        ).innerHTML =
            cpuUsage >= 90
                ? statusBadge(
                    "Critical",
                    "status-danger"
                )
                : statusBadge(
                    "Normal",
                    "status-good"
                );

        setText(
            "memoryCurrent",
            `${memory.usagePercent}%`
        );

        document.getElementById(
            "memoryCondition"
        ).innerHTML =
            memoryUsage >= 90
                ? statusBadge(
                    "Critical",
                    "status-danger"
                )
                : statusBadge(
                    "Normal",
                    "status-good"
                );

        setText(
            "diskCurrent",
            `${disk.usage}%`
        );

        document.getElementById(
            "diskCondition"
        ).innerHTML =
            diskUsage >= 90
                ? statusBadge(
                    "Critical",
                    "status-danger"
                )
                : statusBadge(
                    "Normal",
                    "status-good"
                );

        setText(
            "postgresCurrent",
            security.services?.postgresql?.status ||
            "Unknown"
        );

        document.getElementById(
            "postgresCondition"
        ).innerHTML =
            security.services?.postgresql?.running
                ? statusBadge(
                    "Healthy",
                    "status-good"
                )
                : statusBadge(
                    "Critical",
                    "status-danger"
                );

        setText(
            "firewallCurrent",
            security.firewall?.status ||
            "Unknown"
        );

        document.getElementById(
            "firewallCondition"
        ).innerHTML =
            security.firewall?.installed
                ? statusBadge(
                    "Available",
                    "status-good"
                )
                : statusBadge(
                    "Attention",
                    "status-warning"
                );

        // Failed login detection can be unavailable
        // because /var/log/btmp requires elevated permission.

        if (security.failedLogins?.available) {

            setText(
                "failedLoginCurrent",
                security.failedLogins.count
            );

            document.getElementById(
                "failedLoginCondition"
            ).innerHTML =
                security.failedLogins.count > 0
                    ? statusBadge(
                        "Attention",
                        "status-warning"
                    )
                    : statusBadge(
                        "Normal",
                        "status-good"
                    );

        } else {

            setText(
                "failedLoginCurrent",
                "Permission unavailable"
            );

            document.getElementById(
                "failedLoginCondition"
            ).innerHTML =
                statusBadge(
                    "Unavailable",
                    "status-warning"
                );

        }

        // =================================================
        // Alert Table
        // =================================================

        const table =
            document.getElementById(
                "alertsTable"
            );

        table.innerHTML = "";

        if (alerts.length === 0) {

            table.innerHTML = `

                <tr>

                    <td colspan="3">

                        <span class="status status-good">
                            No active alerts
                        </span>

                    </td>

                </tr>

            `;

        } else {

            alerts.forEach(
                (alert) => {

                    const row =
                        document.createElement(
                            "tr"
                        );

                    const severityClass =
                        alert.severity === "Critical"
                            ? "status-danger"
                            : "status-warning";

                    row.innerHTML = `

                        <td>

                            <span class="status ${severityClass}">
                                ${alert.severity}
                            </span>

                        </td>

                        <td>
                            ${alert.source}
                        </td>

                        <td>
                            ${alert.message}
                        </td>

                    `;

                    table.appendChild(row);

                }
            );

        }

    } catch (error) {

        console.error(
            "Alerts Page Error:",
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
            loadAlerts();
        }

    }
);

// =====================================================
// Refresh Every 5 Seconds
// =====================================================

setInterval(() => {

    if (auth.currentUser) {
        loadAlerts();
    }

}, 5000);
