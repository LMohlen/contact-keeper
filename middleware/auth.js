import jwt from 'jsonwebtoken';
import dotenv, { config } from 'dotenv';
dotenv.config();

module.exports = function (req, res, next) {
	// Get token from header
	const token = req.header('x-auth-token');

	// Check if not token
	if (!token) {
		return res.status(401).json({ message: 'No token, authorization denied.' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		req.user = decoded.user;
		next();
	} catch (err) {
		res.status(401).json({ message: 'Token is not valid' });
	}
};
