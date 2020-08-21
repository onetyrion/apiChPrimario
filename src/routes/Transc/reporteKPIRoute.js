//dependences
const reporteKPIRoute = require("express").Router();
const { check, validationResult } = require('express-validator');

//Controllers
const { ListreporteKPI,creatingReporteKPI,updateReporteKPI,deleteReporteKPI } = require("../../controllers/Transc/reporteKPI.controller");


//Routes Controllers
reporteKPIRoute.post('/', [
    check('Fecha', 'La fecha es Obligatoria').not().isEmpty(),
    check('Resultado_kpi', 'El resultado del kpi es Obligatorio').not().isEmpty(),
    check('Mes', 'El mes es Obligatorio').not().isEmpty(),
    check('Id_maquinaria', 'La maquinaria tiene que ser valido').isInt(),
    check('Id_kpi', 'El KPI tiene que ser valido').isInt(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errores: errors.array()
        })
    }
    creatingReporteKPI(req, res);
});

reporteKPIRoute.get('/', ListreporteKPI);

reporteKPIRoute.put('/:Id_reportekpi', [
    check('Fecha', 'La fecha es Obligatoria').not().isEmpty(),
    check('Resultado_kpi', 'El resultado del kpi es Obligatorio').not().isEmpty(),
    check('Mes', 'El mes es Obligatorio').not().isEmpty(),
    check('Id_maquinaria', 'La maquinaria tiene que ser valido').isInt(),
    check('Id_kpi', 'El KPI tiene que ser valido').isInt(),
], async (req, res) => {
    const errors = validationResult(req);
    console.log(errors)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errores: errors.array()
        })
    }
    updateReporteKPI(req, res);
});

reporteKPIRoute.delete('/:Id_reportekpi', deleteReporteKPI)

module.exports = reporteKPIRoute;