const express = require("express");
const userRoutes = express.Router();
const authorize = require("../Middlewares/authorizationMiddleware");
const { register, login, checkUser } = require("../Controllers/userController");

userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.get("/checkUser", authorize, checkUser);

module.exports = userRoutes;
