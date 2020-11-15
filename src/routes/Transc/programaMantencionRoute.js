//dependences
const pMantencionRoute = require("express").Router();
const { check, validationResult } = require('express-validator');

//Controllers
const { ListProgramaMantencion, creatingPMantencion, updatePMantencion, DeletePMantencion } = require("../../controllers/Transc/programaMantencion.controller");


//Routes Controllers
pMantencionRoute.post('/', [
    check('Meta', 'El resultado del kpi es Obligatorio').isFloat(),
    check('Anio', 'El Año es Obligatorio').isInt(),
    check('Id_maquinaria', 'La maquinaria tiene que ser valido').isInt(),
    check('Id_kpi', 'El KPI tiene que ser valido').isInt(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        })
    }
    creatingPMantencion(req, res);
});

pMantencionRoute.get('/', ListProgramaMantencion);

pMantencionRoute.put('/:id_ProgramaMantencion', [
    check('Meta', 'El resultado del kpi es Obligatorio').isFloat(),
    check('Anio', 'El Año es Obligatorio').isInt(),
    check('Id_maquinaria', 'La maquinaria tiene que ser valido').isInt(),
    check('Id_kpi', 'El KPI tiene que ser valido').isInt(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        })
    }
    updatePMantencion(req, res);
});

pMantencionRoute.delete('/:id_ProgramaMantencion', DeletePMantencion)

module.exports = pMantencionRoute;