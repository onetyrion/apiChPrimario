const router = require('express').Router();

//Imports
const middleware = require('./middlewares');
const apiUserRoute = require('./usersRoute');
const loginRoute = require('./loginRoute');
const factRouter = require('./factRoute');
const authRoute = require('./authRoute');
const componentRoute = require('./componentRoute');

//Routers
router.use('/auth', authRoute);
router.use('/users', middleware.checkToken, apiUserRoute);
router.use('/login',middleware.checkToken, loginRoute);
router.use('/dm', middleware.checkToken,factRouter);

router.use('/components',middleware.checkToken,componentRoute);


module.exports = router;