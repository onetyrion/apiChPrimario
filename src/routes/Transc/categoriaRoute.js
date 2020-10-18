//dependences
const categoriaRoute = require("express").Router();

//Controllers
const { Listcategoria } = require("../../controllers/Transc/categoria.controller");

categoriaRoute.get('/', Listcategoria);

module.exports = categoriaRoute;