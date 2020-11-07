//dependences
const eventoRoute = require("express").Router();

//Controllers
const { ListEvento } = require("../../controllers/Transc/eventoMantencion.controller");

eventoRoute.get('/', ListEvento);

module.exports = eventoRoute;