const mongoose = require('mongoose');
const config = require('config');
// const db = config.get('mongoURI');
// const db = `${process.env.DATABASE}`

const connectDB = async () => {
	try {
		await mongoose.connect(`${process.env.DATABASE}`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
		});
		console.log(`connected to DB`);
	} catch (error) {
		// Exit process with failure.
		console.error(error.message);
		process.exit(1);
	}
};
module.exports = connectDB;
