//dependences
const areaProductivaRoute = require("express").Router();

//Controllers
const { ListareaProductiva } = require("../../controllers/Transc/areaProductiva.controller");

areaProductivaRoute.get('/', ListareaProductiva);

module.exports = areaProductivaRoute;