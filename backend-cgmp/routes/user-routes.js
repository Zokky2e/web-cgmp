const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");

// Registration and login routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);
router.get("/user/status", userController.getUserStatus);

// Define CRUD routes
router.post("/users", userController.createUser);
router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

module.exports = router;
