const express = require("express");
const router = express.Router();
const polygonController = require("../controllers/polygon-controller");
const isAuthenticated = require("../middleware/authentication");

router.get("/pagedPolygon", polygonController.getPolygons);
router.get("/polygon", polygonController.getAllPolygons);
router.get("/polygon/:id/:x/:y/:z", polygonController.getPolygonById);
router.get("/polygon/:id/:created_at", polygonController.getPolygonById);
router.post("/polygon", isAuthenticated, polygonController.postPolygons);
router.post(
	"/requestedPolygon/:id",
	isAuthenticated,
	polygonController.requestPolygon
);
router.get(
	"/requestedPolygon",
	isAuthenticated,
	polygonController.getRequestedPolygons
);
router.get(
	"/requestedPolygon/:id",
	isAuthenticated,
	polygonController.getRequestedPolygonById
);
router.post(
	"/polygon/accept/:id",
	isAuthenticated,
	polygonController.acceptPolygonRequest
);
router.get(
	"/ownedPolygons",
	isAuthenticated,
	polygonController.getOwnedPolygons
);
router.delete(
	"/polygon/requested/:id/:userId",
	isAuthenticated,
	polygonController.denyPolygonRequest
);

router.delete(
	"/polygon/:id/",
	isAuthenticated,
	polygonController.deletePolygon
);

module.exports = router;
