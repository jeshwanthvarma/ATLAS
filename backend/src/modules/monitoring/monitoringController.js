const monitoringService = require("./monitoringService");

// =====================================================
// System Information
// =====================================================

exports.getSystem = async (req, res) => {

    try {

        const data = await monitoringService.getSystemInfo();

        res.status(200).json(data);

    } catch (error) {

        console.error("System Error:", error);

        res.status(500).json({
            error: "Failed to retrieve system information."
        });

    }

};

// =====================================================
// CPU Information
// =====================================================

exports.getCpu = async (req, res) => {

    try {

        const data = await monitoringService.getCpuInfo();

        res.status(200).json(data);

    } catch (error) {

        console.error("CPU Error:", error);

        res.status(500).json({
            error: "Failed to retrieve CPU information."
        });

    }

};

// =====================================================
// Memory Information
// =====================================================

exports.getMemory = async (req, res) => {

    try {

        const data = await monitoringService.getMemoryInfo();

        res.status(200).json(data);

    } catch (error) {

        console.error("Memory Error:", error);

        res.status(500).json({
            error: "Failed to retrieve memory information."
        });

    }

};

// =====================================================
// Disk Information
// =====================================================

exports.getDisk = async (req, res) => {

    try {

        const data = await monitoringService.getDiskInfo();

        res.status(200).json(data);

    } catch (error) {

        console.error("Disk Error:", error);

        res.status(500).json({
            error: "Failed to retrieve disk information."
        });

    }

};

// =====================================================
// Network Information
// =====================================================

exports.getNetwork = async (req, res) => {

    try {

        const data = await monitoringService.getNetworkInfo();

        res.status(200).json(data);

    } catch (error) {

        console.error("Network Error:", error);

        res.status(500).json({
            error: "Failed to retrieve network information."
        });

    }

};

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

exports.getHealth = async (req, res) => {

    try {

        const data = await monitoringService.getHealthStatus();

        res.status(200).json(data);

    } catch (error) {

        console.error("Health Error:", error);

        res.status(500).json({
            error: "Failed to retrieve health status."
        });

    }

};