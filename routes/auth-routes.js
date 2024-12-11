const express = require('express');
const {loginUser, registerUser, logoutUser, authMiddleware, checkAuth} = require("../controllers/auth/auth-controller");
const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', logoutUser);
authRouter.get('/check-auth', authMiddleware,checkAuth);

module.exports = authRouter;