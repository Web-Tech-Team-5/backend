const express = require('express');
const {loginUser, registerUser, logoutUser, authMiddleware, checkAuth ,checkUser,sendOTP,verifyOTPSent} = require("../controllers/auth/auth-controller");
const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', logoutUser);
authRouter.get('/check-auth', authMiddleware,checkAuth);
authRouter.get('/check-user', checkUser);
authRouter.post('/send-otp', sendOTP);
authRouter.post('/verify-otp-sent', verifyOTPSent);

module.exports = authRouter;