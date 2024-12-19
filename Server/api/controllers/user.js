import User from "../models/user.js";
import { hash, compare, signToken } from '../util/auth.js';

const registerUser = async (req, res) => {
    try {
        const { username, password, preferences = [] } = req.body;

        if (!username || !password) {
            return res.status(422).json({ error: 'Must provide both username and password' });
        }

        const hashedPassword = await hash(password);

        // Create the user with preferences included
        const userEntry = await User.create({
            username,
            password: hashedPassword,
            preferences: []
        });

        res.json({ _id: userEntry._id, 
            username: userEntry.username, 
            preferences: userEntry.preferences 
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(422).json({ error: 'Must provide both username and password' });
        }

        const userEntry = await User.findOne({ username: username.toLowerCase() });
        if (!userEntry) {
            return res.status(401).json({ error: 'Invalid username' });
        }

        const PasswordEqual = await compare(password, userEntry.password);
        if (!PasswordEqual) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = signToken(userEntry.username, userEntry._id);

        res.json({
            _id: userEntry._id,
            username: userEntry.username,
            preferences: userEntry.preferences, // Return preferences with the response
            token_type: 'Bearer',
            access_token: token
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getUserById = async (req, res) => {
    try {
        const {user_id} = req.verified;
        const {id} = req.params;

        // ensure the user id in the header matches id provided in URL
        if (user_id !== id) {
            return res.status(403).json({ error: ' Forbidden: You are not this guest.'});
        }
        console.log('id');

        // find the user by _id
        const userWithMealplans = await User.findById(id)
        .select('-password')
        .populate('mealplans');
        
        res.json(userWithMealplans);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const putUserById = async (req, res) => {
    try {
        // Ensure that `req.verified` is defined before destructuring
        const { user_id } = req.verified || {}; // Default to an empty object if `verified` is undefined
        const { id } = req.params; // Extract the user ID from the URL parameters
        const { preferences } = req.body; // Extract preferences from the request body

        if (!user_id) {
            return res.status(401).json({ error: 'Unauthorized: user not verified' });
        }

        // Ensure the user ID in the header matches the ID in the URL
        if (user_id !== id) {
            return res.status(403).json({ error: 'Forbidden: You are not this user.' });
        }

        // Validate preferences input (optional: you can add further validation if needed)
        if (!preferences || !Array.isArray(preferences)) {
            return res.status(400).json({ error: 'Preferences must be an array.' });
        }

        // Find the user by ID and update their preferences
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { preferences: preferences }, // Update the preferences field
            { new: true, runValidators: true } // Return the updated document and validate fields
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Return the updated user data (excluding password for security reasons)
        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            preferences: updatedUser.preferences
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

export { registerUser, loginUser, getUserById, putUserById };