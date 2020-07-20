const router = require('express').Router();

const middleware = require('./middlewares');
const loginRoute = require('./loginRoute');
const apiUserRoute = require('./usersRoute');
const FACT_MantencionRouter = require('./FACT_mantencionesRoute');

router.use('/users', middleware.checkToken, apiUserRoute);
router.use('/login', loginRoute);
router.use('/dm',FACT_MantencionRouter);
module.exports = router;