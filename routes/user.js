const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
require('dotenv').config();


const { check, validationResult } = require('express-validator');

// Get user model
const User = require('../models/User');

// Make query

// @route GET     api/users
// @description:  Test route
// @access        Public

router.get('/', (req, res) => {
	res.render('users/index', { user: new User() });
});

// @route        POST api/users
// @description:  Get user
// @access        Public

router.post(
	'/',
	[
		check('name', 'Name is required').not().isEmpty(),
		check('email', 'Email is not valid').isEmail(),
		check(
			'password',
			'Please enter a Password with 6 or more characters'
		).isLength({ min: 6 }),
	],
	async (req, res) => {
		console.log(req.body);
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, password } = req.body;
		try {
			let user = await User.findOne({ email });
			// See if user exists

			if (user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'User already exists' }] });
			}

			// Get user gravatar
			const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });

			// create user intance
			user = new User({ name, email, avatar, password });

			// Encryot password
			const salt = await bcrypt.genSalt(10);

			user.password = await bcrypt.hash(password, salt);
			await user.save();

			// Return jsonwebtoken

			// create payload, mongoose uses id for abstraction
			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(
				payload,
				`${process.env.JWT_SECRET}`,
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
