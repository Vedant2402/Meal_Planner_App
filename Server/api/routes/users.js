import express from 'express';

import { registerUser, loginUser, getUserById, putUserById } from "../controllers/user.js";

import { verifyUsers } from '../middleware/authorization.js';

const router = express.Router();

// POST /user/register
router.post('/register', registerUser);

// POST /user/login
router.post('/login', loginUser);

// GET /users/:id
router.get('/:id', verifyUsers, getUserById); 

// PUT /users/:id
router.put('/:id', verifyUsers, putUserById);

export default router;