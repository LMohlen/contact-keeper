import { Router } from 'express';
import User from '../models/User.js';
import { check, validationResult } from 'express-validator';

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
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		res.send('Passed');
	}
);

export default router;
