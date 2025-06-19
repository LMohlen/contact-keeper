import { connect } from 'mongoose';
import config from 'config';
const db = config.get('mongoURI');

const connectDB = async () => {
	try {
		await connect(db);

		console.log('MongoDB Connected...');
	} catch (err) {
		console.log(err.message);
		process.exit(1);
	}
};

export default connectDB;
