/* eslint-disable camelcase */
import axios from 'axios';
import express from 'express';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';
import { mealSearch } from '../controllers/meal.js';

const router = express.Router();

// Middleware to verify JWT and extract user ID
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract Bearer token

    if (!token) {
        return res.status(403).json({ error: 'Token is required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        // Attach the decoded user data to the request object for use in the route
        req.user = decoded;
        next();
    });
};

// GET /meals/search
router.get('/search', verifyToken, mealSearch);

export default router;
