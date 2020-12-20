// Imports------------------------
const FACT_MantencionRouter = require("express").Router();

const { check, validationResult } = require("express-validator");
//Controllers-------------------
const {
    // ListDMMantencionesDisponibilidad,ListTiposMantencion,ListComponentesMantencion,ListEventoMantencion,ListDisponibilidadAnual,ListMTTR ,ListMTBF,ListMTBME, 
    ListDisponibilidadAnual,LISTAVIEWDETENCIONES, LISTAVIEWDISPONIBILIDAD, ScheduleETL,GETSCHEDULEJOB} = require("../controllers/DM_Mantencion.controller");

//Routes------------------
// FACT_MantencionRouter.get('/',ListDMMantencionesDisponibilidad);
// FACT_MantencionRouter.get('/tiposmantencion/:year',ListTiposMantencion);
// FACT_MantencionRouter.get('/tiposcomponentes/:year',ListComponentesMantencion);
// FACT_MantencionRouter.get('/eventosmantencion/:year',ListEventoMantencion);
// FACT_MantencionRouter.get('/mttranual/:year',ListMTTR);
// FACT_MantencionRouter.get('/mtbfanual/:year',ListMTBF);
// FACT_MantencionRouter.get('/mtbmeanual/:year',ListMTBME);
FACT_MantencionRouter.get('/disponibilidadanual/:year/:equipo',ListDisponibilidadAnual);
FACT_MantencionRouter.get('/pivotDetenciones',LISTAVIEWDETENCIONES);
FACT_MantencionRouter.get('/pivotDisponibilidad',LISTAVIEWDISPONIBILIDAD);


FACT_MantencionRouter.get('/ETL',GETSCHEDULEJOB);
FACT_MantencionRouter.post('/ETL', [
    check('intjob_name', 'El campo intjob_name es Obligatorio').isString(),
    check('intname', 'El campo intname es Obligatorio').isString(),
    check('intenabled', 'El campo intenabled es Obligatorio').isInt(),
    check('intfreq_type', 'El campo intfreq_type es Obligatorio').isInt(),
    check('intfreq_interval', 'El campo intfreq_interval es Obligatorio').isInt(),
    check('intfreq_subday_type', 'El campo intfreq_subday_type es Obligatorio').isInt(),
    check('intfreq_subday_interval', 'El campo intfreq_subday_interval es Obligatorio').isInt(),
    check('intfreq_relative_interval', 'El campo intfreq_relative_interval es Obligatorio').isInt(),
    check('intfreq_recurrence_factor', 'El campo intfreq_recurrence_factor es Obligatorio').isInt(),
    check('intactive_start_date', 'El campo intactive_start_date es Obligatorio').isInt(),
    check('intactive_end_date', 'El campo intactive_end_date es Obligatorio').isInt(),
    check('intactive_start_time', 'El campo intactive_start_time es Obligatorio').isInt(),
    check('intactive_end_time', 'El campo intactive_end_time es Obligatorio').isInt()
], async (req, res) => {
    console.log("route");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        })
    }
    ScheduleETL(req, res);
    
});


module.exports = FACT_MantencionRouter;