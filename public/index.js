function generateAccessToken(username) {
	return jwt.sign(username, config.get('jwtSecret'), { expiresIn: '300000s' });
}

module.exports = generateAccessToken;
