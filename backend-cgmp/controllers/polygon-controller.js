const axios = require("axios");
const _ = require("underscore");
const mongoose = require("mongoose");
const Polygon = require("../models/polygon");
const RequestedPolygon = require("../models/requestedPolygon"); // Import the model
const OwnedPolygon = require("../models/ownedPolygon"); // Import the model

exports.getPolygons = async (req, res) => {
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 10;
	const skip = (page - 1) * limit;

	try {
		const response = await axios.get(
			`http://api.agromonitoring.com/agro/1.0/polygons?appid=${process.env.agromonitoring_api_key}`
		);
		const polygons = response.data;

		// Slice the array to implement pagination

		// Get all polygonIds that are already taken from the Polygon table
		const takenPolygons = await Polygon.find({}, "polygonId");
		const takenPolygonIds = new Set(takenPolygons.map((p) => p.polygonId));

		const availablePolygons = polygons.filter(
			(polygon) => !takenPolygonIds.has(polygon.id)
		);

		const paginatedPolygons = availablePolygons.slice(skip, skip + limit);
		res.status(200).json({
			total: polygons.length,
			page,
			limit,
			totalPages: Math.ceil(availablePolygons.length / limit),
			data: paginatedPolygons,
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.getAllPolygons = async (req, res) => {
	try {
		const response = await axios.get(
			`http://api.agromonitoring.com/agro/1.0/polygons?appid=${process.env.agromonitoring_api_key}`
		);
		const polygons = response.data;
		res.status(200).json(polygons);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.getPolygonById = async (req, res) => {
	const created_at = parseInt(req.params.created_at, 10);
	const id = req.params.id;

	const oneDayInSeconds = 86400; // Number of seconds in a day
	const range = oneDayInSeconds; // 7 days in seconds
	const start = created_at - range * 7;
	const end = created_at + range / 12;

	const url_step1 = `http://api.agromonitoring.com/agro/1.0/image/search?start=${start}&end=${end}&polyid=${id}&appid=${process.env.agromonitoring_api_key}`;
	axios
		.get(url_step1)
		.then(async (result) => {
			if (_.isArray(result.data) && result.data.length > 0) {
				const imageUrl = result.data[0].stats.ndvi;
				const imageResponse = await axios({
					url: imageUrl,
					method: "GET",
					responseType: "stream",
				});

				res.setHeader("Content-Type", "image/png");
				// Pipe the image data to the response
				imageResponse.data.pipe(res);
			} else {
				res.status(404).json({ message: "No image found" });
			}
		})
		.catch((error) => {
			console.log(error);
			res.status(400).json({ message: error.message });
		});
};

exports.postPolygons = async (req, res) => {
	try {
		const polygons = req.body;
		const savedPolygons = await Promise.all(
			polygons.map(async (polygonData) => {
				const url = `http://api.agromonitoring.com/agro/1.0/polygons?appid=${process.env.agromonitoring_api_key}`;
				const response = await axios.post(url, polygonData);
				return response.data;
			})
		);
		res.status(201).json(savedPolygons);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.getRequestedPolygons = async (req, res) => {
	try {
		const userId = req.user.id;
		const requestedPolygons = await RequestedPolygon.find({ userId });
		res.status(200).json(requestedPolygons);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.getRequestedPolygonById = async (req, res) => {
	try {
		const polygonId = req.params.id;
		const requestedPolygons = await RequestedPolygon.find({
			polygonId,
		}).populate("userId", "firstName lastName age");

		if (requestedPolygons.length === 0) {
			return res.status(200).json([]);
		}

		res.status(200).json(requestedPolygons);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.requestPolygon = async (req, res) => {
	try {
		const userId = req.user.id;
		console.log(userId);
		const polygonId = req.params.id;

		const existingRequest = await RequestedPolygon.findOne({
			polygonId,
			userId,
		});

		if (existingRequest) {
			return res.status(400).json({
				message:
					"Request for this polygon has already been made by the user.",
			});
		}

		const requestedPolygon = new RequestedPolygon({
			polygonId,
			userId,
		});

		await requestedPolygon.save();

		res.status(201).json({
			message: "Polygon request saved successfully.",
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Accept a user request for a polygon
exports.acceptPolygonRequest = async (req, res) => {
	const { id } = req.params; // Polygon ID
	const { userId } = req.body; // User ID of the user to accept

	try {
		// Remove all other requests for this polygon
		await RequestedPolygon.deleteMany({
			polygonId: id,
		});

		// Add the accepted polygon to the OwnedPolygon collection
		const ownedPolygon = new OwnedPolygon({
			polygonId: id,
			userId,
		});

		await ownedPolygon.save();

		res.status(200).json({
			message:
				"User request accepted and polygon added to ownership successfully.",
			ownedPolygon,
		});
	} catch (error) {
		res.status(500).json({ message: "Error accepting user request." });
	}
};

// Deny a user request for a polygon
exports.denyPolygonRequest = async (req, res) => {
	const { id, userId } = req.params; // Polygon ID and User ID

	try {
		await RequestedPolygon.deleteOne({ polygonId: id, userId });

		res.status(200).json({ message: "User request denied successfully." });
	} catch (error) {
		res.status(500).json({ message: "Error denying user request." });
	}
};

// Fetch paginated owned polygons with optional filtering by userId
exports.getOwnedPolygons = async (req, res) => {
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 10;
	const skip = (page - 1) * limit;
	const userId = req.query.userId;

	try {
		// Build the query with optional userId filtering
		const query = userId ? { userId } : {};

		const ownedPolygons = await OwnedPolygon.find(query)
			.populate("userId", "firstName lastName") // Optional: Populate user details
			.skip(skip)
			.limit(limit)
			.exec();

		const total = await OwnedPolygon.countDocuments(query);

		const response = await axios.get(
			`http://api.agromonitoring.com/agro/1.0/polygons?appid=${process.env.agromonitoring_api_key}`
		);
		const polygons = response.data;

		const polygonMap = new Map();
		polygons.forEach((polygon) => {
			polygonMap.set(polygon.id, polygon.name); // Assuming each polygon has an 'id' and 'name'
		});

		// Step 4: Add polygon names to ownedPolygons
		const ownedPolygonsWithNames = ownedPolygons.map((ownedPolygon) => {
			const polygonName =
				polygonMap.get(ownedPolygon.polygonId) || "Unknown";
			return {
				...ownedPolygon._doc, // Use `_doc` to ensure we are modifying the plain object representation
				polygonName,
			};
		});

		res.status(200).json({
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
			data: ownedPolygonsWithNames,
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.deletePolygon = async (req, res) => {
	try {
		const polygonId = req.params.id;

		// Step 1: Delete the polygon from the Agromonitoring API
		const response = await axios.delete(
			`http://api.agromonitoring.com/agro/1.0/polygons/${polygonId}?appid=${process.env.agromonitoring_api_key}`
		);
		console.log(response);
		if (response.status !== 204) {
			return res.status(response.status).json({
				message:
					response?.data?.message ||
					"Failed to delete polygon from Agromonitoring API.",
			});
		}

		// Step 2: Delete all related entries from the OwnedPolygon and RequestedPolygon collections
		await Promise.all([
			OwnedPolygon.deleteMany({ polygonId }),
			RequestedPolygon.deleteMany({ polygonId }),
		]);

		// Step 3: Send a success response
		res.status(200).json({
			message:
				"Polygon deleted successfully along with all related owned and requested polygons.",
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
