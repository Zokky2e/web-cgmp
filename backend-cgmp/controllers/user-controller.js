const User = require("../models/user");
const passport = require("passport");

exports.registerUser = async (req, res) => {
	try {
		const { email, password, firstName, lastName } = req.body;
		const newUser = new User({
			email,
			password,
			firstName,
			lastName,
			age: 18,
			job: "",
		});
		await newUser.save();
		res.status(201).json(newUser);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Login a user
exports.loginUser = (req, res, next) => {
	passport.authenticate("local", (err, user, info) => {
		if (err) return next(err);
		if (!user) return res.status(400).json({ message: info.message });
		req.logIn(user, (err) => {
			if (err) return next(err);
			return res.json({ message: "Logged in successfully", user });
		});
	})(req, res, next);
};

exports.logoutUser = (req, res) => {
	req.logout((err) => {
		if (err) {
			return res.status(500).json({ message: err.message });
		}
		req.session.destroy((err) => {
			if (err) {
				return res.status(500).json({ message: err.message });
			}
			res.clearCookie("connect.sid", { path: "/" });
			res.status(200).json({ message: "Logged out successfully" });
		});
	});
};

exports.getUserStatus = async (req, res) => {
	try {
		if (req.isAuthenticated()) {
			// Assuming req.user is set by Passport.js
			const user = await User.findById(req.user._id).exec();
			res.status(200).json({
				isAuthenticated: true,
				user: {
					id: user._id,
					email: user.email,
					name: user.name,
					job: user.job,
				},
			});
		} else {
			res.status(200).json({
				isAuthenticated: false,
				user: null,
			});
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Create a new user
exports.createUser = async (req, res) => {
	try {
		const user = new User(req.body);
		await user.save();
		res.status(201).json(user);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Read all users
exports.getAllUsers = async (req, res) => {
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 10;
	const skip = (page - 1) * limit;

	const searchQuery = req.query.searchQuery || ""; // Single search query parameter

	try {
		// Build the search query
		const query = {};

		if (searchQuery) {
			query.$or = [
				{ email: { $regex: searchQuery, $options: "i" } },
				{ firstName: { $regex: searchQuery, $options: "i" } },
				{ lastName: { $regex: searchQuery, $options: "i" } },
			];
		}
		const users = await User.find(query).skip(skip).limit(limit);

		const totalUsers = await User.countDocuments(query);

		res.status(200).json({
			total: totalUsers,
			page,
			limit,
			totalPages: Math.ceil(totalUsers / limit),
			data: users,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Read a single user by ID
exports.getUserById = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) return res.status(404).json({ message: "User not found" });
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Update a user by ID
exports.updateUser = async (req, res) => {
	try {
		const user = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		if (!user) return res.status(404).json({ message: "User not found" });
		res.status(200).json(user);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		if (!user) return res.status(404).json({ message: "User not found" });
		res.status(204).json();
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
