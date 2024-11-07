# Meal_Planner_App
Expanding the Node.js RESTful API for the Meal Planner.

**Part 1 - Authentication and Authorization**

Password Hashing with scrypt
Use Node.js's built-in crypto module to hash and compare passwords with scrypt.
The password must be hashed before storing it in the database.

JWT with jsonwebtoken
After a successful login create a JWT that includes necessary user details.
Token should be sent back to the REST client and used in the Authorization header for protected routes.

Middleware for Protected Routes
Create an express.js middleware function to check for a valid JWT
When the token is valid add the verified user details to the request object
Otherwise return a 401 Unauthorized error.

**Part 2 - Database Integration with MongoDB and Mongoose.**

Mongoose Schema + Models
Use the User and Mealplan Schemas and Models created in Lab 3, including any virtuals.
 
Add Any Necessary Hooks for Database Operations
Implement pre or post hooks in the User and Mealplan models as needed
 
Update All Routes to Interact with Mongoose Models
Modify the functionality in the routes to use the Mongoose Models to interact with MongoDB for all CRUD operations
Remove all references to mock.js

**Part 3 - Layered Architecture**

Update Homework 2 to use **Layered Architecture** by are creating lightweight routes, robust controllers and smart models. This ensures clear separation of concerns and maintains modularity.

Update Architecture:
Route files import only their respective controller
Controllers import only their respective models
If a controller does not have its own model but depends on another model to function, it may import the necessary model
Models do not import other models (using the import statement).

/mealplan-app
│
├── /routes  
              
│   ├── user.js                # User related routes

│   ├── mealplan.js            # Mealplan related routes

│   └── meal.js                # Meal related routes

│
├── /controllers         

│   ├── user.js                # Handles user operations

│   ├── mealplan.js            # Handles mealplan operations

│   └── meal.js                # Handles meal search operations

│
├── /models                

│   ├── User.js                # User schema + model

│   └── Mealplan.js            # Mealplan schema + model

│
├── /middleware            

│   └── authorization.js       # JWT verification for protected routes

│
├── /utils                

│   └── auth.js                # Auth hash and compare + JWT sign and verify

│
├── /db               
│   └── connection.js          # Connection function to MongoDB

│
├── .env                       # Environment variables (Spoonacular API, DB connection, JWT secret)

├── app.js                     # Starts the app and connect to MongoDB
