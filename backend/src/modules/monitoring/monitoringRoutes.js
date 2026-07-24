const express = require("express");
const router = express.Router();

const monitoringController = require("./monitoringController");

router.get("/system", monitoringController.getSystem);
router.get("/cpu", monitoringController.getCpu);
router.get("/memory", monitoringController.getMemory);
router.get("/disk", monitoringController.getDisk);
router.get("/network", monitoringController.getNetwork);
router.get("/services", monitoringController.getServices);
router.get("/status", monitoringController.getHealth);

module.exports = router;
