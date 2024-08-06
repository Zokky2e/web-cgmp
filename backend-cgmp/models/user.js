const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	id: String,
	email: { type: String, unique: true },
	password: String,
	name: String,
	age: Number,
	job: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
