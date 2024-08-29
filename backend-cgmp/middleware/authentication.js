const isAuthenticated = (req, res, next) => {
	if (req.session.passport && req.session.passport.user) {
		// User is authenticated, proceed to the next middleware or route handler
		return next();
	} else {
		// User is not authenticated, respond with an unauthorized error or redirect to login
		return res.status(401).json({ message: "Unauthorized access" });
		// Alternatively, you can redirect to a login page
		// return res.redirect('/login');
	}
};

module.exports = isAuthenticated;
