//dependences
const tipoMantencionRoute = require("express").Router();

//Controllers
const { ListTipoMantencion } = require("../../controllers/Transc/tipoMantencion.controller");

tipoMantencionRoute.get('/', ListTipoMantencion);

module.exports = tipoMantencionRoute;