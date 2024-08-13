const express = require("express");
require("dotenv").config();
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = require("./models/user");
const userRoutes = require("./routes/user-routes");
const polygonRoutes = require("./routes/polygon-routes");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
	cors({
		origin: "http://localhost:3001", // Replace this with your frontend's origin
		credentials: true,
	})
);
app.use(
	session({
		secret: "yourSecretKey",
		resave: false,
		saveUninitialized: false,
	})
);
mongoose
	.connect("mongodb://localhost:27017/cgmp-dev")
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("Could not connect to MongoDB...", err));
// Middleware

app.use(passport.initialize());
app.use(passport.session());

passport.use(
	new LocalStrategy(
		{ usernameField: "email" }, // Use 'email' as the username field
		async (email, password, done) => {
			try {
				const user = await User.findOne({ email });
				if (!user) {
					return done(null, false, { message: "Incorrect email." });
				}

				const match = await user.comparePassword(
					password,
					user.password
				);
				if (!match) {
					return done(null, false, {
						message: "Incorrect password.",
					});
				}

				return done(null, user);
			} catch (err) {
				return done(err);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (err) {
		done(err);
	}
});

// Use user routes
app.use("/api", userRoutes);

// Use polygon routes
app.use("/api", polygonRoutes);

// Start the server
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
