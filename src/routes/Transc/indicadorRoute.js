//dependences
const indicadorRoute = require("express").Router();

//Controllers
const { ListIndicador } = require("../../controllers/Transc/indicador.controller");

indicadorRoute.get('/', ListIndicador);

module.exports = indicadorRoute;