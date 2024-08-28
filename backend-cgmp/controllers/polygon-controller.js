const axios = require("axios");
const _ = require("underscore");
const Polygon = require("../models/polygon");
const RequestedPolygon = require("../models/requestedPolygon"); // Import the model

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
//OLD postPolygon
// exports.postPolygons = async (req, res) => {
// 	try {
// 		const userId = req.user.id;
// 		const polygons = req.body;
// 		//console.log(req.body);
// 		const savedPolygons = await Promise.all(
// 			polygons.map(async (polygonData) => {
// 				const polygon = new Polygon({
// 					userId,
// 					polygonId: polygonData.id,
// 					createdAt: new Date(polygonData.created_at),
// 				});
// 				console.log(polygon);
// 				const url = `http://api.agromonitoring.com/agro/1.0/polygons?appid=${process.env.agromonitoring_api_key}`;
// 				await axios
// 					.post(url, polygonData)
// 					.then(async (r) => {
// 						polygon.polygonId = r.data.id;
// 						await polygon.save();
// 					})
// 					.catch((err) => console.log(err));
// 			})
// 		);
// 		res.status(201).json(savedPolygons);
// 	} catch (error) {
// 		res.status(400).json({ message: error.message });
// 	}
// };

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

exports.requestPolygon = async (req, res) => {
	try {
		const userId = req.user.id;
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
