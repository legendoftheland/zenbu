const mongoose = require('mongoose');
require('dotenv').config();

module.exports = {
    init: () => {
        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false,
            connectTimeoutMS: 10000,
            family: 4
        };

        mongoose.connect(`mongodb+srv://zenbu:${process.env.MONGO_PASS}@zenbu.p061f.mongodb.net/zenbu?retryWrites=true&w=majority`, dbOptions);
        mongoose.Promise = global.Promise;

        mongoose.connection.on('connected', () => {
            console.log('Connected to MongoDB.')
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Disconnected from MongoDB.')
        });

        mongoose.connection.on('err', (err) => {
            console.log('An error occurred with MongoDB. See the error: \n' + err)
        });
    }
}
