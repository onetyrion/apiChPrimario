//dependences
const tipoMaquinariaRoute = require("express").Router();

//Controllers
const { ListtipoMaquinaria } = require("../../controllers/Transc/tipoMaquinaria.controller");

tipoMaquinariaRoute.get('/', ListtipoMaquinaria);

module.exports = tipoMaquinariaRoute;