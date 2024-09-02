const mongoose = require("mongoose");

const ThreadSchema = new mongoose.Schema({
	title: {
		type: String,
		required: function () {
			return this.isThread; // Title is required only if isThread is true
		},
	},
	message: {
		type: String,
		required: true,
	},
	timestamp: {
		type: Date,
		default: Date.now,
	},
	isThread: {
		type: Boolean,
		default: true,
	},
	mainThreadId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Thread", // References itself for sub-messages
		required: function () {
			return !this.isThread; // Required if it's a message and not a thread
		},
	},
	creatorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User", // Reference to User model
		required: true,
	},
});

module.exports = mongoose.model("Thread", ThreadSchema);
