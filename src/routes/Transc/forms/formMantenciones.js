const fmantencionRoute = require("express").Router();
const { check, validationResult } = require('express-validator');
//Controllers
const { creatingfMantencion, ListfMantencion, UpdatefMantencion, DeletefMantencion} = require("../../../controllers/Transc/fmantencion.controller");

//Routes Controllers
fmantencionRoute.post('/', [
    check('Id_componente', 'El componente es Obligatorio').isInt(),
    check('Id_evento', 'El evento es Obligatorio').isInt(),
    check('Id_tipo', 'El tipo es Obligatorio').isInt(),
    check('Fecha_mantencion', 'La fecha es Obligatoria').isDate(),
    check('CantEvento_especial', 'La cantidad de eventos especiales son obligatorias').isInt(),
    check('Duracion', 'La duracion es Obligatoria').isFloat(),
    check('Descripcion', 'la descripcion es Obligatoria').not().isEmpty(),
    check('Horas_programadas', 'las horas son obligatorias').isFloat(),
    check('Horas_no_programadas', 'las horas son obligatorias').isFloat(),
    check('Cantidad_evProgramados', 'La cantidad de eventos son obligatorias').isInt(),
    check('Cantidad_evNoProgramados', 'La cantidad de eventos son obligatorias').isInt(),
    check('RFCA', 'El RFCA es Obligatorio').isInt(),
    check('Area', 'El Area es Obligatorio').not().isEmpty(),
    check('OT', 'La OT es Obligatoria').isInt(),
    check('Id_falla', 'La falla es Obligatoria').isInt()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errores: errors.array()
        })
    }
    creatingfMantencion(req, res);
    
});

fmantencionRoute.put('/:Id_mantencion', [
    check('Id_componente', 'El componente es Obligatorio').isInt(),
    check('Id_evento', 'El evento es Obligatorio').isInt(),
    check('Id_tipo', 'El tipo es Obligatorio').isInt(),
    check('Fecha_mantencion', 'La fecha es Obligatoria').isDate(),
    check('CantEvento_especial', 'La cantidad de eventos especiales son obligatorias').isInt(),
    check('Duracion', 'La duracion es Obligatoria').isFloat(),
    check('Descripcion', 'la descripcion es Obligatoria').not().isEmpty(),
    check('Horas_programadas', 'las horas son obligatorias').isFloat(),
    check('Horas_no_programadas', 'las horas son obligatorias').isFloat(),
    check('Cantidad_evProgramados', 'La cantidad de eventos son obligatorias').isInt(),
    check('Cantidad_evNoProgramados', 'La cantidad de eventos son obligatorias').isInt(),
    check('RFCA', 'El RFCA es Obligatorio').isInt(),
    check('Area', 'El Area es Obligatorio').not().isEmpty(),
    check('OT', 'La OT es Obligatoria').isInt(),
    check('Id_falla', 'La falla es Obligatoria').isInt()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errores: errors.array()
        })
    }
    UpdatefMantencion(req, res);
});

fmantencionRoute.delete('/:Id_mantencion', DeletefMantencion)
fmantencionRoute.get('/', ListfMantencion);

module.exports = fmantencionRoute;