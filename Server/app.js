/*
    steps to run:
    1. install dependencies: npm install
    2. start the server with nodemon: npm run dev
*/
import cors from 'cors';
import 'dotenv/config';
import express from 'express';

import mongodb from './db/connection.js';

import mealplans from './api/routes/mealplans.js';
import users from './api/routes/users.js';
import meals from './api/routes/meals.js'

const app = express();
const PORT = 8080;

const options ={ exposedHeader:['Authorization'] };
app.use(cors(options));

console.log(process.env.SPOONACULAR_API_KEY)

app.use(express.json());

app.use('/mealplans', mealplans);
app.use('/users', users);
app.use('/meals', meals);


app.listen(PORT, async () => {
    // connecting to mongo db before starting the server
    await mongodb.connect();

    // log the server's URL and port to the console
    console.log(`Server is running on localhost:${PORT}`);
});
