const os = require("os");
const { execSync } = require("child_process");

// ==========================
// Utility Functions
// ==========================

const formatBytes = (bytes) => {
    return (bytes / (1024 ** 3)).toFixed(2) + " GB";
};

const formatUptime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs} Hours ${mins} Minutes`;
};

// ==========================
// System Information
// ==========================

const getSystemInfo = () => ({
    hostname: os.hostname(),
    platform: os.platform(),
    architecture: os.arch(),
    uptime: formatUptime(os.uptime()),
    nodeVersion: process.version,
    cpuCores: os.cpus().length,
    totalMemory: formatBytes(os.totalmem()),
    freeMemory: formatBytes(os.freemem())
});

// ==========================
// CPU Information
// ==========================

const getCpuInfo = () => {
    const cpus = os.cpus();

    return {
        model: cpus[0].model,
        cores: cpus.length,
        speedMHz: cpus[0].speed,
        loadAverage: {
            oneMinute: os.loadavg()[0],
            fiveMinutes: os.loadavg()[1],
            fifteenMinutes: os.loadavg()[2]
        }
    };
};

// ==========================
// Memory Information
// ==========================

const getMemoryInfo = () => {

    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;

    return {

        totalMemory: formatBytes(total),
        usedMemory: formatBytes(used),
        freeMemory: formatBytes(free),
        usagePercent: ((used / total) * 100).toFixed(2) + "%"

    };
};

// ==========================
// Disk Information
// ==========================

const getDiskInfo = () => {

    try {

        const output = execSync("df -h /")
            .toString()
            .split("\n")[1]
            .trim()
            .split(/\s+/);

        return {

            filesystem: output[0],
            size: output[1],
            used: output[2],
            available: output[3],
            usage: output[4],
            mountedOn: output[5]

        };

    } catch (error) {

        return {

            error: "Unable to retrieve disk information."

        };

    }

};

// ==========================
// Network Information
// ==========================

const getNetworkInfo = () => {

    const interfaces = os.networkInterfaces();

    for (const name in interfaces) {

        for (const net of interfaces[name]) {

            if (net.family === "IPv4" && !net.internal) {

                return {

                    interface: name,
                    ipAddress: net.address,
                    macAddress: net.mac

                };

            }

        }

    }

    return {

        message: "No active network interface found."

    };

};

// ==========================
// Health Status
// ==========================

const getHealthStatus = () => ({

    status: "Healthy",
    timestamp: new Date().toISOString(),
    uptime: formatUptime(os.uptime()),
    cpuCores: os.cpus().length,
    totalMemory: formatBytes(os.totalmem()),
    freeMemory: formatBytes(os.freemem())

});

// ==========================
// Export Functions
// ==========================

module.exports = {

    getSystemInfo,
    getCpuInfo,
    getMemoryInfo,
    getDiskInfo,
    getNetworkInfo,
    getHealthStatus

};