const router = require('express').Router();

//Imports
const middleware = require('./middlewares');
const apiUserRoute = require('./usersRoute');
const loginRoute = require('./loginRoute');
const factRouter = require('./FactRoute');
const authRoute = require('./authRoute');

//Routers
router.use('/auth', authRoute);
router.use('/users', middleware.checkToken, apiUserRoute);
router.use('/login',middleware.checkToken, loginRoute);
router.use('/dm', middleware.checkToken,factRouter);

module.exports = router;