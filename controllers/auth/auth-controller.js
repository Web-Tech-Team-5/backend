const validate = require('validator');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SALT_FACTOR = 10;

//register user controller
const registerUser = async (req, res) => {
    try {
        //get all required fields
        const {name,email,password,confirmPassword,role} = req.body;

        //check whether the required fields are empty

        if(!name || !email || !password || !role || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please enter the required fields',
            });
        }

        const fields = [name, email, password,confirmPassword, role];

        if (fields.some(field => !field || (typeof field === "string" && field.trim() === ""))) {
           return res.status(400).json({
                success: false,
                message: 'Please enter the required fields',
            });
        }

        //normalizing email
        console.log('Original Email:', email);
        const normalizedEmail = validate.normalizeEmail(email);
        console.log('Normalized Email:', normalizedEmail);

        //check if the user already exists or not
        const user = await User.findOne({email: normalizedEmail});

        //user exists
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        //user doesn't exist

        //check if the password is valid or not
        if (!validate.isStrongPassword(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must have at least 8 characters and include at least one uppercase letter, one number, and one special character"
            });
        }

        //check if the password and confirm password match or not
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        //password hashing for security

        //generate salt
        const salt = await bcrypt.genSalt(SALT_FACTOR);

        //generate hashed Password
        const hashedPassword = await bcrypt.hash(password, salt);

        //register the user now

        //create a local instance of the user
        const newUser = new User({
            name: name,
            role:role,
            password: hashedPassword,
            email: normalizedEmail,
        });

        //saving the user to database
        await newUser.save();

        return res.status(201).json({
            success: true,
            message: 'User successfully registered!',
            newUser
        });

    } catch (err) {
        console.error(err);
        // Handle Mongoose validation errors
        if (err.name === 'ValidationError') {
            const errorMessages = Object.values(err.errors).map(error => error.message);
            return res.status(400).json({
                success: false,
                message: errorMessages.toString()
            });
        }
        // Handle unexpected errors
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

//login user controller
const loginUser = async (req, res) => {
    try {
        ///get all required fields
        const {email, password} = req.body;

        //check whether the required fields are empty

        if(!email || !password) {
              return res.status(400).json({
                success: false,
                message: 'Please enter the required fields',
            });
        }

        const fields = [email, password];

        if (fields.some(field => !field || (typeof field === "string" && field.trim() === ""))) {
            res.status(400).json({
                success: false,
                message: 'Please enter the required fields',
            })
        }

        //check if the user exists or not
        const user = await User.findOne({email: email});

        //user doesn't exist implies user is not registered
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User is not registered"
            });
        }

        //user exists, time for authentication

        //check if the entered password matches the correct password
        const isPasswordMatch = await bcrypt.compare(password, user['password']);

        //password doesn't match
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Wrong password, Please try again"
            });
        }

        //password matches

        //create token
        //jwt.sign(payload, secretOrPrivateKey, [options], [callback])
        //payload will later be used to get user info
        const token = await jwt.sign({
                id: user["_id"],
                role: user['role'],
                email: user['email'],
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: '30d',
            });

        //final response
        res.cookie('token', token,
            {httpOnly: true, secure: false})
            .status(200)
            .json({
                success: true,
                message: "User successfully logged in",
                user: {
                    id: user["_id"],
                    role: user['role'],
                    email: user['email'],
                },
                token
            });

    } catch (error) {
        console.log(error);
        //handle Mongoose Validation Error
        if (error.name === 'ValidationError') {
            const errorMessages = Object.values(error.errors).map(error => error.message);
            return res.status(400).json({
                success: false,
                message: errorMessages.toString()
            });
        }
        //handle Unexpected Error
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

//logout user controller
const logoutUser = async (req, res) => {
    res.clearCookie('token').status(200).json({
        success: true,
        message: 'Logged out successfully!'
    });
}

//auth middleware
const authMiddleware = async (req, res, next) => {
    //acquire token
    const token = req.cookies.token;
    //if token is expired or not present
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }
    try {
        //decode token
        req.user = jwt.verify(token, process.env.JWT_SECRET_KEY);
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }
}

//check-auth
const checkAuth = async (req, res) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        message: 'Authenticated user',
        user: {
            id: user['_id'],
            role: user['role'],
            email: user['email'],
        }
    })}

module.exports = {registerUser, loginUser, logoutUser, authMiddleware,checkAuth};