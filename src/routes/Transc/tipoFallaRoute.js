//dependences
const tipoFallaRoute = require("express").Router();

//Controllers
const { ListTipoFalla } = require("../../controllers/Transc/tipoFalla.controller");

tipoFallaRoute.get('/', ListTipoFalla);

module.exports = tipoFallaRoute;