import { Router } from 'express';
const router = Router();
import User from '../models/User.js';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', (req, res) => {
	res.send('Get logged in user');
});

// @route   POST api/auth
// @desc    Auth user & get token
// @access  Public
router.post(
	'/',
	[
		check('email', 'Please include a valid email').isEmail(),
		check('password', 'Password is required'),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;

		try {
			let user = await User.findOne({ email });
			if (!user) {
				return res.Status(400).json({ message: 'Invalid Credentials' });
			}

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({ message: 'Invalid Credentials' });
			}
			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(
				payload,
				process.env.JWT_SECRET,
				{
					expiresIn: 360000,
				},
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (err) {
			console.log(err.message);
			res.status(500).json('Internal Server Error');
		}
	}
);

export default router;
