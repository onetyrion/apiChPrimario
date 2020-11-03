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
const fallaComponenteRoute = require('./Transc/fallaComponenteRoute');
const fMantencion = require('./Transc/formMantenciones');
const fUsuario = require('./Transc/formUsuarios');
const areaProductiva = require('./Transc/areaProductivaRoute');
const tipoMaquinariaRoute = require('./Transc/tipoMaquinariaRoute');
const categoria = require('./Transc/categoriaRoute');
const tipoFalla = require('./Transc/tipoFallaRoute');

//Routers BASE
router.use('/auth', authRoute);
router.use('/users', middleware.checkToken, apiUserRoute);
router.use('/login',middleware.checkToken, loginRoute);
router.use('/vauth', middleware.checkToken, vauthRoute);
// router.use('/dm', middleware.checkToken,factRouter);
router.use('/registrarusuario',middleware.checkToken,fUsuario);

//Routers TRANSC
router.use('/components',middleware.checkToken,componentRoute);
router.use('/fallacomponente',middleware.checkToken,fallaComponenteRoute);
router.use('/mantencion',middleware.checkToken,mantencionRoute);
router.use('/fallamantencion',middleware.checkToken,fallamantencionRoute);
router.use('/falla',middleware.checkToken,fallaRoute);
router.use('/maquinaria',middleware.checkToken,maquinariaRoute);
router.use('/registrarmantencion',middleware.checkToken,fMantencion);
router.use('/areaProductiva',middleware.checkToken,areaProductiva);
router.use('/tipoMaquinaria',middleware.checkToken,tipoMaquinariaRoute);
router.use('/categoria',middleware.checkToken,categoria);
router.use('/tipofalla',middleware.checkToken,tipoFalla);


module.exports = router;