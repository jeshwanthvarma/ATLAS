const monitoringService = require("./monitoringService");

exports.getSystem = (req, res) => {
    res.json(monitoringService.getSystemInfo());
};

exports.getCpu = (req, res) => {
    res.json(monitoringService.getCpuInfo());
};

exports.getMemory = (req, res) => {
    res.json(monitoringService.getMemoryInfo());
};

exports.getDisk = (req, res) => {
    res.json(monitoringService.getDiskInfo());
};

exports.getNetwork = (req, res) => {
    res.json(monitoringService.getNetworkInfo());
};
exports.getHealth = (req, res) => {
    res.json(monitoringService.getHealthStatus());
};