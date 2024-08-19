const mongoose = require("mongoose");

const polygonSchema = new mongoose.Schema({
	polygonId: { type: String, required: true },
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	createdAt: { type: Date, default: Date.now },
});

const Polygon = mongoose.model("Polygon", polygonSchema);
module.exports = Polygon;
