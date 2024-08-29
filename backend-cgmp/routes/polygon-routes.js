const express = require("express");
const router = express.Router();
const polygonController = require("../controllers/polygon-controller");
const isAuthenticated = require("../middleware/authentication");

router.get("/pagedPolygon", polygonController.getPolygons);
router.get("/polygon", polygonController.getAllPolygons);
router.get("/polygon/:id/:x/:y/:z", polygonController.getPolygonById);
router.get("/polygon/:id/:created_at", polygonController.getPolygonById);
router.post("/polygon", isAuthenticated, polygonController.postPolygons);
router.get(
	"/polygon/requested",
	isAuthenticated,
	polygonController.getRequestedPolygons
);
router.post(
	"/polygon/request/:id",
	isAuthenticated,
	polygonController.requestPolygon
);
module.exports = router;
