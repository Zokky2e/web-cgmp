const express = require("express");
const router = express.Router();
const polygonController = require("../controllers/polygon-controller");

router.get("/polygon", polygonController.getPolygons);
router.get("/polygon/:id/:x/:y/:z", polygonController.getPolygonById);
router.get("/polygon/:id/:created_at", polygonController.getPolygonById);

module.exports = router;
