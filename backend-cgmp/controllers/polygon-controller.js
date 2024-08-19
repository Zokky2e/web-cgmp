const axios = require("axios");
const _ = require("underscore");
const Polygon = require("../models/polygon");
exports.getPolygons = async (req, res) => {
	axios
		.get(
			`http://api.agromonitoring.com/agro/1.0/polygons?appid=${process.env.agromonitoring_api_key}`
		)
		.then((result) => {
			res.status(200).json(result.data);
		})
		.catch((error) => {
			res.status(400).json({ message: error.message });
		});
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
		const userId = req.user.id;
		const polygons = req.body;
		//console.log(req.body);
		const savedPolygons = await Promise.all(
			polygons.map(async (polygonData) => {
				const polygon = new Polygon({
					userId,
					polygonId: polygonData.id,
					createdAt: new Date(polygonData.created_at),
				});
				console.log(polygon);
				const url = `http://api.agromonitoring.com/agro/1.0/polygons?appid=${process.env.agromonitoring_api_key}`;
				await axios
					.post(url, polygonData)
					.then(async (r) => {
						polygon.polygonId = r.data.id;
						await polygon.save();
					})
					.catch((err) => console.log(err));
			})
		);
		res.status(201).json(savedPolygons);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
