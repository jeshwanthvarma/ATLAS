// ======================================================
// ATLAS Dashboard
// ======================================================

let cpuChart = null;

// Create chart only if Chart.js is loaded
if (typeof Chart !== "undefined") {

    cpuChart = new Chart(document.getElementById("cpuChart"), {

        type: "line",

        data: {

            labels: [],

            datasets: [{

                label: "Free Memory (GB)",

                data: [],

                borderColor: "#4F46E5",

                backgroundColor: "rgba(79,70,229,0.15)",

                fill: true,

                tension: 0.35

            }]

        },

        options: {

            responsive: true,

            animation: false,

            scales: {

                y: {

                    beginAtZero: true

                }

            }

        }

    });

} else {

    console.warn("Chart.js not loaded. Chart disabled.");

}

async function updateDashboard() {

    try {

        const response = await API.getSystem();

        if (!response.success) {

            console.error("Failed to fetch system information.");

            return;

        }

        // api.js wraps backend JSON inside response.data
        const system = response.data;

        // -------------------------
        // System Information
        // -------------------------

        document.getElementById("hostname").textContent =
            system.hostname || "N/A";

        document.getElementById("platform").textContent =
            system.platform || "N/A";

        document.getElementById("architecture").textContent =
            system.architecture || "N/A";

        document.getElementById("nodeVersion").textContent =
            system.nodeVersion || "N/A";

        document.getElementById("uptime").textContent =
            system.uptime || "N/A";

        // -------------------------
        // Update Chart
        // -------------------------

        if (cpuChart) {

            let freeMemory = 0;

            if (typeof system.freeMemory === "string") {

                freeMemory = parseFloat(system.freeMemory);

            } else {

                freeMemory = Number(system.freeMemory);

            }

            cpuChart.data.labels.push(
                new Date().toLocaleTimeString()
            );

            cpuChart.data.datasets[0].data.push(
                freeMemory
            );

            if (cpuChart.data.labels.length > 15) {

                cpuChart.data.labels.shift();

                cpuChart.data.datasets[0].data.shift();

            }

            cpuChart.update();

        }

    }

    catch (error) {

        console.error("Dashboard Error:", error);

    }

}

// Initial Load
updateDashboard();

// Refresh every 5 seconds
setInterval(updateDashboard, 5000);