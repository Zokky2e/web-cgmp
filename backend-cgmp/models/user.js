const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	firstName: String,
	lastName: String,
	age: Number,
	job: String,
});

// Hash the password before saving the user model
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});

// Compare input password with hashed password
userSchema.methods.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
