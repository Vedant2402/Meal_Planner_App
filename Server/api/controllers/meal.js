import axios from 'axios';
import User from "../models/user.js";

const SPOONACULAR_API_URL = process.env.SPOONACULAR_API_URL;
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;


const mealSearch = async (req, res) => {
    try {
        //const user_id = Number(req.headers.user_id);
        const { meal, diets } = req.query;

        // optional - below
        // split the preferences into an array or set to an empty array
        let queryPreferences = diets ? diets.split(',') : [];

        // concat user preferences with preferences passed into query params
        const response = await axios.get(SPOONACULAR_API_URL, {
            params: {
                apiKey: SPOONACULAR_API_KEY,
                query: meal,
                diet: queryPreferences.join(","),
                addRecipeInformation: true // boolean flag to return diets array
            }
        });

        res.json(response.data.results);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

export { mealSearch };