const router = require('express').Router();

//Imports
const middleware = require('./middlewares');
const apiUserRoute = require('./usersRoute');
const loginRoute = require('./loginRoute');
const authRoute = require('./authRoute');
const componentRoute = require('./Transc/componentRoute');
const mantencionRoute = require('./Transc/mantencionRoute');
const fallamantencionRoute = require('./Transc/fallaMantencionRoute');
const fallaRoute = require('./Transc/fallaRoute');
const maquinariaRoute = require('./Transc/maquinariaRoute');
const vauthRoute = require('./vauthRoute');
const fallaComponenteRoute = require('./Transc/fallaComponenteRoute')
const rMantencion = require('./Transc/formMantenciones');
// const reporteKPIRoute = require('./Transc/reporteKPIRoute');

//Routers BASE
router.use('/auth', authRoute);
router.use('/users', middleware.checkToken, apiUserRoute);
router.use('/login',middleware.checkToken, loginRoute);
router.use('/vauth', middleware.checkToken, vauthRoute);
// router.use('/dm', middleware.checkToken,factRouter);

//Routers TRANSC
router.use('/components',middleware.checkToken,componentRoute);
router.use('/fallacomponente',middleware.checkToken,fallaComponenteRoute);
router.use('/mantencion',middleware.checkToken,mantencionRoute);
router.use('/fallamantencion',middleware.checkToken,fallamantencionRoute);
router.use('/falla',middleware.checkToken,fallaRoute);
router.use('/maquinaria',middleware.checkToken,maquinariaRoute);
router.use('/registrarmantencion',middleware.checkToken,rMantencion);


module.exports = router;