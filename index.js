//external dependencies
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

//internal dependencies
const errorHandler = require('./middlewares/error-handler');
const connectDatabase = require('./config/database');

//route dependencies
const authRouter = require('./routes/auth-routes');
const carRouter = require('./routes/car-routes');

//configure .env file
dotenv.config();

//create server
const app = express();

//use middlewares

//parse post request body/form-data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//parse cookies
app.use(cookieParser());

//logger
app.use(morgan('dev'));

//final error handler
app.use(errorHandler);

//connect to database
connectDatabase()
    .then(() =>
        console.log(`Connected to MONGODB database successfully!`));

//routes
app.use('/api/auth', authRouter);
app.use('/api/car', carRouter);

//set port
app.set('port', process.env.PORT);

//listen to port
app.listen(app.get('port'), () => {
    console.log(`Server started on port ${app.get('port')}`);
});