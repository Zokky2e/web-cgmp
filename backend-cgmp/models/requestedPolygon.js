const mongoose = require("mongoose");

const RequestedPolygonSchema = new mongoose.Schema({
	polygonId: {
		type: String,
		required: true,
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User", // Reference the User model
		required: true,
	},
	timestamp: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("RequestedPolygon", RequestedPolygonSchema);
