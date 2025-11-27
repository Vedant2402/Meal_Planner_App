import express from 'express';

import { verifyUsers } from '../middleware/authorization.js';

import { DeleteUserById, PostUserById } from '../controllers/mealplan.js';

const router = express.Router();
router.use(verifyUsers);

// Add a meal to the user's meal plan
router.post('/', verifyUsers, PostUserById);

// DELETE route to remove a specific meal from a meal plan
router.delete('/:id', verifyUsers, DeleteUserById);

export default router;
