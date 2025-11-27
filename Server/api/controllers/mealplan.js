import MealPlan from '../models/mealplan.js';

const MAX_MEALS = 3;

const PostUserById = async (req, res) => {
    try {
        const { user_id } = req.verified; // user_id extracted from the token
        const { week, mealId, name, diets, image } = req.body;

        if (!user_id) {
            return res.status(403).json({ error: 'Forbidden user' });
        }

        // Find the meal plan for the user and week
        const mealplan = await MealPlan.findOne({ user_id, week });

        // Check if the mealplan exists and if meals are less than the max allowed
        if (mealplan) {
            if (mealplan.meals.length >= MAX_MEALS) {
                return res.status(400).json({ message: 'Mealplan contains the maximum of 3 meals' });
            }

            // Add the meal to the mealplan
            mealplan.meals.push({ mealId, name, diets, image });
            await mealplan.save();

            return res.json(mealplan);
        }

        // If no mealplan exists, create a new one
        const newMealplan = new MealPlan({
            user_id,
            week,
            meals: [{ mealId, name, diets, image }]
        });

        await newMealplan.save();
        return res.json(newMealplan);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const DeleteUserById = async (req, res) => {
    try {
        const { user_id } = req.verified; // Extract the user ID from the verified token
        const id = req.params.id; // The ID in the URL
        
        // Ensure the user_id in the token matches the user_id in the request
        if (user_id !== id) {
            return res.status(403).json({ error: 'You are not authorized to delete this user’s meal plans' });
        }

        // Find and delete the meal plan for the user
        const deletedMealPlan = await MealPlan.findOneAndDelete({ user_id: id });

        if (!deletedMealPlan) {
            return res.status(404).json({ error: 'Meal Plan not found' });
        }

        res.json({
            message: 'All meals deleted successfully',
            deletedMealPlan,
        });
    } catch (error) {
        console.error('Error in DELETE /mealplans/:id:', error);
        res.status(500).json({ error: error.toString() });
    }
};

export { PostUserById, DeleteUserById };