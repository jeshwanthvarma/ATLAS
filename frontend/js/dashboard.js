// =====================================================
// ATLAS Dashboard
// frontend/js/dashboard.js
// =====================================================

import API from "./api.js";
import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// =====================================================
// Authentication
// =====================================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const userName =
        document.getElementById("userName");

    const userEmail =
        document.getElementById("userEmail");

    if (userName) {
        userName.textContent =
            user.displayName || "ATLAS User";
    }

    if (userEmail) {
        userEmail.textContent =
            user.email || "No email";
    }

    try {

        await API.syncUser();

    } catch (error) {

        console.error(
            "User Sync Error:",
            error
        );

    }

    updateDashboard();

});

// =====================================================
// Logout
// =====================================================

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async (e) => {

            e.preventDefault();

            try {

                await signOut(auth);

                window.location.href =
                    "login.html";

            } catch (error) {

                console.error(
                    "Logout Error:",
                    error
                );

            }

        }
    );

}

// =====================================================
// Memory Chart
// =====================================================

let memoryChart = null;

const chartCanvas =
    document.getElementById("cpuChart");

if (
    typeof Chart !== "undefined" &&
    chartCanvas
) {

    memoryChart =
        new Chart(chartCanvas, {

            type: "line",

            data: {

                labels: [],

                datasets: [
                    {
                        label:
                            "Memory Usage %",

                        data: [],

                        borderColor:
                            "#3B82F6",

                        backgroundColor:
                            "rgba(59,130,246,.2)",

                        fill: true,

                        tension: 0.35
                    }
                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                animation: false,

                scales: {

                    y: {
                        beginAtZero: true,
                        max: 100
                    }

                }

            }

        });

}

// =====================================================
// Dashboard Update
// =====================================================

async function updateDashboard() {

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

        // =============================================
        // System Information
        // =============================================

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
            "nodeVersion"
        ).textContent =
            system.nodeVersion || "N/A";

        document.getElementById(
            "uptime"
        ).textContent =
            system.uptime || "N/A";

        // =============================================
        // Monitoring Cards
        // =============================================

        document.getElementById(
            "cpuUsage"
        ).textContent =
            `${cpu.usage ?? 0}%`;

        document.getElementById(
            "memoryUsage"
        ).textContent =
            `${memory.usagePercent ?? 0}%`;

        document.getElementById(
            "diskUsage"
        ).textContent =
            `${disk.usage ?? 0}%`;

        document.getElementById(
            "networkStatus"
        ).textContent =
            network.interface ||
            "Unavailable";

        // =============================================
        // Service Monitoring
        // =============================================

        const servicesGrid =
            document.getElementById(
                "servicesGrid"
            );

        const servicesSummary =
            document.getElementById(
                "servicesSummary"
            );

        if (servicesSummary) {

            servicesSummary.textContent =
                `${services.runningServices} of ${services.totalServices} running`;

        }

        if (servicesGrid) {

            servicesGrid.innerHTML = "";

            services.services.forEach(
                (service) => {

                    const serviceCard =
                        document.createElement(
                            "div"
                        );

                    serviceCard.className =
                        "service-card";

                    const statusClass =
                        service.running
                            ? "service-running"
                            : "service-stopped";

                    serviceCard.innerHTML = `

                        <h3>
                            ${service.name}
                        </h3>

                        <span class="service-status ${statusClass}">
                            ${service.status}
                        </span>

                        <div class="service-details">

                            CPU:
                            ${service.cpu}%<br>

                            Memory:
                            ${service.memory}%

                        </div>

                    `;

                    servicesGrid.appendChild(
                        serviceCard
                    );

                }
            );

        }

        // =============================================
        // Security / Alert Engine
        // =============================================

        const alertsList =
            document.getElementById(
                "alertsList"
            );

        if (alertsList) {

            const alerts = [];

            // High CPU
            if (
                parseFloat(cpu.usage) >= 90
            ) {

                alerts.push(
                    `High CPU usage: ${cpu.usage}%`
                );

            }

            // High Memory
            if (
                parseFloat(
                    memory.usagePercent
                ) >= 90
            ) {

                alerts.push(
                    `High memory usage: ${memory.usagePercent}%`
                );

            }

            // High Disk
            if (
                parseFloat(disk.usage) >= 90
            ) {

                alerts.push(
                    `High disk usage: ${disk.usage}%`
                );

            }

            // PostgreSQL
            if (
                security.services &&
                security.services.postgresql &&
                !security.services
                    .postgresql.running
            ) {

                alerts.push(
                    "PostgreSQL service is not running"
                );

            }

            // Firewall
            if (
                security.firewall &&
                !security.firewall.installed
            ) {

                alerts.push(
                    "Firewall is not installed"
                );

            }

            // Failed logins
            if (
                security.failedLogins &&
                security.failedLogins.available &&
                security.failedLogins.count > 0
            ) {

                alerts.push(
                    `${security.failedLogins.count} failed login attempt(s) detected`
                );

            }

            alertsList.innerHTML = "";

            if (alerts.length === 0) {

                const item =
                    document.createElement(
                        "li"
                    );

                item.textContent =
                    "✓ No active alerts";

                alertsList.appendChild(
                    item
                );

            } else {

                alerts.forEach(
                    (alert) => {

                        const item =
                            document.createElement(
                                "li"
                            );

                        item.textContent =
                            alert;

                        alertsList.appendChild(
                            item
                        );

                    }
                );

            }

        }

        // =============================================
        // Memory Chart
        // =============================================

        if (memoryChart) {

            memoryChart.data.labels.push(
                new Date()
                    .toLocaleTimeString()
            );

            memoryChart
                .data
                .datasets[0]
                .data
                .push(
                    parseFloat(
                        memory.usagePercent
                    ) || 0
                );

            // Keep latest 20 readings
            if (
                memoryChart
                    .data
                    .labels
                    .length > 20
            ) {

                memoryChart
                    .data
                    .labels
                    .shift();

                memoryChart
                    .data
                    .datasets[0]
                    .data
                    .shift();

            }

            memoryChart.update();

        }

    } catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );

    }

}

// =====================================================
// Automatic Refresh - Every 5 Seconds
// =====================================================

setInterval(() => {

    if (auth.currentUser) {

        updateDashboard();

    }

}, 5000);