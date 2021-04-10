const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const auth = require('../middleware/auth');

// @route GET     api/auth
// @description:  Test route
// @access        Public

router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		const { newUser } = user;
		console.log(newUser);

		// res.json(user);
		res.render('/');
	} catch (error) {
		console.log(error.message);
		res.status(500).send('Server error');
		// res.redirect('/');
	}

	// res.send('auth');
});

// @route        POST api/auth
// @description:  Authenticate user and get
// @access        Public

router.post(
	'/',
	[
		check('email', 'Email is not valid').isEmail(),
		check('password', 'Please is required').exists(),
	],
	async (req, res) => {
		console.log(req.body);
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// return res.status(400).json({ errors: errors.array() });
			return res.redirect('users');
		}

		const { email, password } = req.body;
		try {
			let user = await User.findOne({ email });
			// See if user exists

			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid credentials' }] });
			}

			// match user
			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid credentials' }] });
			}

			// create payload, mongoose uses id for abstraction
			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{ expiresIn: 360000 },
				(err, token) => {
					if (err) throw err;

					res.json({ token });
				}
			);

			// res.send('user registered');
		} catch (error) {
			console.log(error.message);
			res.status(500).send('Server Error');
		}
	}
);
module.exports = router;
