const express = require("express");
const router = express.Router();
const polygonController = require("../controllers/polygon-controller");
const isAuthenticated = require("../middleware/authentication");

router.get("/polygon", polygonController.getPolygons);
router.get("/polygon/:id/:x/:y/:z", polygonController.getPolygonById);
router.get("/polygon/:id/:created_at", polygonController.getPolygonById);
router.post("/polygon", isAuthenticated, polygonController.postPolygons);

module.exports = router;
