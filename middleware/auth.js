const jwt = require('jsonwebtoken');

// next runs after this is done to next middleware
module.exports = function (req, res, next) {
	// Get token from headers
	const token = req.header('x-auth-token');

	// check if not token
	if (!token) {
		return res.status(401).json({ msg: 'No token authorization denied' });
	}

	// Verify token

	try {
		const decoded = jwt.verify(token, config.get('jwtSecret'));

		req.user = decoded.user;
		next();
	} catch (error) {
		res.status(401).json({ msg: 'Token is not valid' });
	}
};
