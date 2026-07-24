// =====================================================
// ATLAS Monitoring Page
// frontend/js/monitoring.js
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
// Byte Formatter
// =====================================================

function formatBytes(bytes) {

    const value = Number(bytes);

    if (
        !Number.isFinite(value) ||
        value < 0
    ) {

        return "N/A";

    }

    if (value === 0) {
        return "0 B";
    }

    const units = [
        "B",
        "KB",
        "MB",
        "GB",
        "TB"
    ];

    const index =
        Math.min(
            Math.floor(
                Math.log(value) /
                Math.log(1024)
            ),
            units.length - 1
        );

    return (
        value /
        Math.pow(1024, index)
    ).toFixed(2) +
        " " +
        units[index];

}

// =====================================================
// Load Monitoring Data
// =====================================================

async function loadMonitoring() {

    if (!auth.currentUser) {
        return;
    }

    try {

        const [
            cpu,
            memory,
            disk,
            network
        ] = await Promise.all([

            API.getCPU(),

            API.getMemory(),

            API.getDisk(),

            API.getNetwork()

        ]);

        // =================================================
        // Summary
        // =================================================

        setText(
            "cpuUsage",
            `${cpu.usage ?? 0}%`
        );

        setText(
            "memoryUsage",
            `${memory.usagePercent ?? 0}%`
        );

        setText(
            "diskUsage",
            `${disk.usage ?? 0}%`
        );

        setText(
            "networkInterface",
            network.interface || "Unavailable"
        );

        // =================================================
        // CPU
        // =================================================

        setText(
            "cpuModel",
            cpu.model || "N/A"
        );

        setText(
            "cpuManufacturer",
            cpu.manufacturer || "N/A"
        );

        setText(
            "cpuCores",
            cpu.cores ?? "N/A"
        );

        setText(
            "physicalCores",
            cpu.physicalCores ?? "N/A"
        );

        setText(
            "cpuSpeed",
            cpu.speedGHz !== undefined
                ? `${cpu.speedGHz} GHz`
                : "N/A"
        );

        setText(
            "userLoad",
            cpu.userLoad !== undefined
                ? `${cpu.userLoad}%`
                : "N/A"
        );

        setText(
            "systemLoad",
            cpu.systemLoad !== undefined
                ? `${cpu.systemLoad}%`
                : "N/A"
        );

        setText(
            "cpuTemperature",
            cpu.temperature !== "N/A" &&
            cpu.temperature !== undefined
                ? `${cpu.temperature} °C`
                : "N/A"
        );

        // =================================================
        // Memory
        // =================================================

        setText(
            "totalMemory",
            memory.totalMemory || "N/A"
        );

        setText(
            "usedMemory",
            memory.usedMemory || "N/A"
        );

        setText(
            "freeMemory",
            memory.freeMemory || "N/A"
        );

        setText(
            "memoryPercent",
            `${memory.usagePercent ?? 0}%`
        );

        // =================================================
        // Disk
        // =================================================

        setText(
            "filesystem",
            disk.filesystem || "N/A"
        );

        setText(
            "diskMount",
            disk.mount || "N/A"
        );

        setText(
            "diskSize",
            disk.size || "N/A"
        );

        setText(
            "diskUsed",
            disk.used || "N/A"
        );

        setText(
            "diskAvailable",
            disk.available || "N/A"
        );

        // =================================================
        // Network
        // =================================================

        setText(
            "networkName",
            network.interface || "N/A"
        );

        setText(
            "ipAddress",
            network.ipAddress || "N/A"
        );

        setText(
            "macAddress",
            network.macAddress || "N/A"
        );

        setText(
            "rxBytes",
            formatBytes(network.rxBytes)
        );

        setText(
            "txBytes",
            formatBytes(network.txBytes)
        );

        setText(
            "rxPackets",
            network.rxPackets ?? "N/A"
        );

        setText(
            "txPackets",
            network.txPackets ?? "N/A"
        );

    } catch (error) {

        console.error(
            "Monitoring Page Error:",
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

            loadMonitoring();

        }

    }
);

// =====================================================
// Automatic Refresh
// =====================================================

setInterval(() => {

    if (auth.currentUser) {

        loadMonitoring();

    }

}, 5000);
