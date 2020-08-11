//dependences
const mantencionRoute = require("express").Router();
const { check, validationResult } = require('express-validator');

//Controllers
const { creatingMantencion, ListMantencion, UpdateMantencion, DeleteMantencion } = require("../../controllers/Transc/mantencion.controller");


//Routes Controllers
mantencionRoute.post('/', [
    check('Id_componente', 'El componente es Obligatorio').not().isEmpty(),
    check('Id_evento', 'El evento es Obligatorio').not().isEmpty(),
    check('Id_tipo', 'El tipo es Obligatorio').not().isEmpty(),
    check('Fecha_mantencion', 'La fecha es Obligatoria').not().isEmpty(),
    check('Duracion', 'La duracion es Obligatoria').not().isEmpty(),
    check('Descripcion', 'la descripcion es Obligatorio').not().isEmpty(),
    check('Horas_programadas', 'las horas son obligatorias').not().isEmpty(),
    check('Horas_no_programadas', 'las horas son obligatorias').not().isEmpty(),
    check('Cantidad_evProgramados', 'La cantidad de eventos son obligatorias').not().isEmpty(),
    check('Cantidad_evNoProgramados', 'La cantidad de eventos son obligatorias').not().isEmpty(),
    check('RFCA', 'El RFCA es Obligatorio').not().isEmpty(),
    check('Area', 'El Area es Obligatorio').not().isEmpty(),
    check('OT', 'La OT es Obligatorio').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errores: errors.array()
        })
    }
    creatingMantencion(req, res);
});

mantencionRoute.get('/', ListMantencion);

mantencionRoute.put('/:Id_mantencion', [
    check('Id_componente', 'El componente es Obligatorio').not().isEmpty(),
    check('Id_evento', 'El evento es Obligatorio').not().isEmpty(),
    check('Id_tipo', 'El tipo es Obligatorio').not().isEmpty(),
    check('Fecha_mantencion', 'La fecha es Obligatoria').not().isEmpty(),
    check('Duracion', 'La duracion es Obligatoria').not().isEmpty(),
    check('Descripcion', 'la descripcion es Obligatorio').not().isEmpty(),
    check('Horas_programadas', 'las horas son obligatorias').not().isEmpty(),
    check('Horas_no_programadas', 'las horas son obligatorias').not().isEmpty(),
    check('Cantidad_evProgramados', 'La cantidad de eventos son obligatorias').not().isEmpty(),
    check('Cantidad_evNoProgramados', 'La cantidad de eventos son obligatorias').not().isEmpty(),
    check('RFCA', 'El RFCA es Obligatorio').not().isEmpty(),
    check('Area', 'El Area es Obligatorio').not().isEmpty(),
    check('OT', 'La OT es Obligatorio').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errores: errors.array()
        })
    }
    UpdateMantencion(req, res);
});

mantencionRoute.delete('/:Id_mantencion', DeleteMantencion)

module.exports = mantencionRoute;