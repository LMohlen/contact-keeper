import { Router } from 'express';
import User from '../models/User.js';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
	'/',
	[
		check('name', 'Please add a name').not().isEmpty(),
		check('email', 'Please include a valid email.').isEmail(),
		check(
			'password',
			'Please enter a password with 6 or more characters'
		).isLength({ min: 6 }),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, password } = req.body;

		try {
			let user = await User.findOne({ email });

			if (user) {
				return res.status(400).json({ message: 'User already exists' });
			}

			user = new User({
				name,
				email,
				password,
			});

			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);

			await user.save();
			
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
			res.status(500).json({ message: 'Internal Server Error' });
		}
	}
);

export default router;
