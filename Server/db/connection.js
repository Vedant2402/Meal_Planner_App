//mongodb+srv://vedantkankate22:<db_password>@cluster0.lbd00.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

import mongoose from 'mongoose';

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_ADDRESS = process.env.DB_ADDRESS;
const DB_NAME = process.env.DB_NAME;

//temp
import User from '../api/models/user.js';
import MealPlan from '../api/models/mealplan.js';

// import users from'../api/models/users.js';
// import mealplans from '../api/models/mealplans.js';

const connect = async () => {
    try {
        const MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_ADDRESS}/?retryWrites=true&w=majority&appName=Cluster0`
        await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
        console.log('Connected to Mongo');
    } catch (error) {
        console.error(`Error connecting to Mongo:, ${error.message}`);
        //process.exit(1);
    }
};

export default { connect };


