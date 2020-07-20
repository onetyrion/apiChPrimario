// Imports------------------------
const FACT_MantencionRouter = require("express").Router();
const { check, validationResult} = require('express-validator');

//Controllers-------------------
const {ListDMMantencionesDisponibilidad,ListTiposMantencion,ListComponentesMantencion,ListEventoMantencion,ListDisponibilidadAnual,ListMTTR ,ListMTBF,ListMTBME} = require("../controllers/DM_Mantencion.controller");

//Routes------------------
FACT_MantencionRouter.get('/',ListDMMantencionesDisponibilidad);
FACT_MantencionRouter.get('/tiposmantencion/:year',ListTiposMantencion);
FACT_MantencionRouter.get('/tiposcomponentes/:year',ListComponentesMantencion);
FACT_MantencionRouter.get('/eventosmantencion/:year',ListEventoMantencion);
FACT_MantencionRouter.get('/disponibilidadanual/:year',ListDisponibilidadAnual);
FACT_MantencionRouter.get('/mttranual/:year',ListMTTR);
FACT_MantencionRouter.get('/mtbfanual/:year',ListMTBF);
FACT_MantencionRouter.get('/mtbmeanual/:year',ListMTBME);

module.exports = FACT_MantencionRouter;