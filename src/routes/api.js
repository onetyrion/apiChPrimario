const router = require('express').Router();

const middleware = require('./middlewares');
const apiLoginRoute = require('./loginRoute');
const apiUserRoute = require('./usersRoute');

router.use('/users',middleware.checkToken,apiUserRoute);
router.use('/login',apiLoginRoute);

module.exports = router;