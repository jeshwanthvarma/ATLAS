const os = require("os");
const si = require("systeminformation");

// =====================================================
// Utility Functions
// =====================================================

const formatBytes = (bytes) => {
    return (bytes / (1024 ** 3)).toFixed(2) + " GB";
};

const formatUptime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    return `${hrs} Hours ${mins} Minutes`;
};

// =====================================================
// System Information
// =====================================================

async function getSystemInfo() {

    const cpu = await si.cpu();

    return {
        hostname: os.hostname(),
        platform: os.platform(),
        architecture: os.arch(),
        uptime: formatUptime(os.uptime()),
        nodeVersion: process.version,
        cpuModel: cpu.brand,
        cpuManufacturer: cpu.manufacturer,
        cpuCores: cpu.cores,
        totalMemory: formatBytes(os.totalmem()),
        freeMemory: formatBytes(os.freemem())
    };
}

// =====================================================
// CPU Information
// =====================================================

async function getCpuInfo() {

    const cpu = await si.cpu();
    const load = await si.currentLoad();
    const temp = await si.cpuTemperature();

    return {
        model: cpu.brand,
        manufacturer: cpu.manufacturer,
        cores: cpu.cores,
        physicalCores: cpu.physicalCores,
        speedGHz: cpu.speed,
        usage: load.currentLoad.toFixed(2),
        userLoad: load.currentLoadUser.toFixed(2),
        systemLoad: load.currentLoadSystem.toFixed(2),
        temperature: temp.main || "N/A"
    };
}

// =====================================================
// Memory Information
// =====================================================

async function getMemoryInfo() {

    const mem = await si.mem();

    return {
        totalMemory: formatBytes(mem.total),
        usedMemory: formatBytes(mem.used),
        freeMemory: formatBytes(mem.free),
        usagePercent: ((mem.used / mem.total) * 100).toFixed(2)
    };
}

// =====================================================
// Disk Information
// =====================================================

async function getDiskInfo() {

    const disks = await si.fsSize();

    if (!disks.length) {
        return {
            message: "No disk information."
        };
    }

    const disk = disks[0];

    return {
        filesystem: disk.fs,
        size: formatBytes(disk.size),
        used: formatBytes(disk.used),
        available: formatBytes(disk.size - disk.used),
        usage: disk.use.toFixed(2),
        mount: disk.mount
    };
}

// =====================================================
// Network Information
// =====================================================

async function getNetworkInfo() {

    const interfaces = await si.networkInterfaces();
    const stats = await si.networkStats();

    const iface = interfaces.find((i) => !i.internal);

    if (!iface) {
        return {
            message: "No active interface"
        };
    }

    const net = stats.find((s) => s.iface === iface.iface);

    return {
        interface: iface.iface,
        ipAddress: iface.ip4,
        macAddress: iface.mac,
        rxBytes: net ? net.rx_bytes : 0,
        txBytes: net ? net.tx_bytes : 0,
        rxPackets: net ? net.rx_packets : 0,
        txPackets: net ? net.tx_packets : 0
    };
}

// =====================================================
// Service Monitoring
// =====================================================

async function getServicesInfo() {

    const serviceNames = [
        "postgresql",
        "ssh",
        "nginx",
        "docker"
    ];

    const services = [];

    for (const serviceName of serviceNames) {

        try {

            const result = await si.services(serviceName);

            if (!result || result.length === 0) {

                services.push({
                    name: serviceName,
                    running: false,
                    status: "Not Installed",
                    pid: null,
                    cpu: 0,
                    memory: 0
                });

                continue;
            }

            const service = result[0];

            services.push({
                name: serviceName,
                running: Boolean(service.running),
                status: service.running ? "Running" : "Stopped",
                pid: service.pid || null,
                cpu: Number(service.cpu || 0).toFixed(2),
                memory: Number(service.mem || 0).toFixed(2)
            });

        } catch (error) {

            services.push({
                name: serviceName,
                running: false,
                status: "Unavailable",
                pid: null,
                cpu: 0,
                memory: 0
            });
        }
    }

    return {
        timestamp: new Date().toISOString(),
        totalServices: services.length,
        runningServices: services.filter(
            (service) => service.running
        ).length,
        services
    };
}
// =====================================================
// Service Monitoring
// =====================================================

exports.getServices = async (req, res) => {

    try {

        const data = await monitoringService.getServicesInfo();

        res.status(200).json(data);

    } catch (error) {

        console.error("Services Error:", error);

        res.status(500).json({
            error: "Failed to retrieve service information."
        });

    }

};
// =====================================================
// Health Status
// =====================================================

async function getHealthStatus() {

    const cpu = await getCpuInfo();
    const memory = await getMemoryInfo();
    const disk = await getDiskInfo();

    return {
        status: "Healthy",
        timestamp: new Date().toISOString(),
        cpuUsage: cpu.usage,
        memoryUsage: memory.usagePercent,
        diskUsage: disk.usage,
        uptime: formatUptime(os.uptime())
    };
}

// =====================================================
// Exports
// =====================================================

module.exports = {
    getSystemInfo,
    getCpuInfo,
    getMemoryInfo,
    getDiskInfo,
    getNetworkInfo,
    getServicesInfo,
    getHealthStatus
};