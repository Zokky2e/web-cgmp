const mongoose = require("mongoose");

const OwnedPolygonSchema = new mongoose.Schema({
	polygonId: {
		type: String,
		required: true,
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	acquiredAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("OwnedPolygon", OwnedPolygonSchema);
