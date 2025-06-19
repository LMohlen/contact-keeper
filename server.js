import express from 'express';
import connectDB from './config/db.js';

import usersRoute from './routes/users.js';
import contactsRoute from './routes/contacts.js';
import authRoute from './routes/auth.js';

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.get('/', (req, res) =>
	res.json({ message: 'Welcome to the Contact Keeper API' })
);

// Define Routes
app.use('/api/users', usersRoute);
app.use('/api/contacts', contactsRoute);
app.use('/api/auth', authRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
