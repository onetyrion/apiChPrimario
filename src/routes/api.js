const router = require('express').Router();

//Imports
const middleware = require('./middlewares');
const apiUserRoute = require('./usersRoute');
const loginRoute = require('./loginRoute');
const factRouter = require('./factRoute');
const authRoute = require('./authRoute');
const componentRoute = require('./Transc/componentRoute');
const mantencionRoute = require('./Transc/mantencionRoute');
const fallamantencionRoute = require('./Transc/fallaMantencionRoute');
const fallaRoute = require('./Transc/fallaRoute');
const reporteKPIRoute = require('./Transc/reporteKPIRoute');
const maquinariaRoute = require('./Transc/maquinariaRoute');

//Routers BASE
router.use('/auth', authRoute);
router.use('/users', middleware.checkToken, apiUserRoute);
router.use('/login',middleware.checkToken, loginRoute);
router.use('/dm', middleware.checkToken,factRouter);

//Routers TRANSC
router.use('/components',middleware.checkToken,componentRoute);
router.use('/mantencion',middleware.checkToken,mantencionRoute);
router.use('/fallamantencion',middleware.checkToken,fallamantencionRoute);
router.use('/falla',middleware.checkToken,fallaRoute);
router.use('/reportekpi',middleware.checkToken,reporteKPIRoute);
router.use('/maquinaria',middleware.checkToken,maquinariaRoute);


module.exports = router;