const express = require('express');
const queryRouter = express.Router();
const {postQuery} = require('../controllers/query/query-controller');

queryRouter.post('/post-query', postQuery);

module.exports = queryRouter;