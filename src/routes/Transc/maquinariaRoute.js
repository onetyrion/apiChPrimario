//dependences
const maquinariaRoute = require("express").Router();
const { check, validationResult } = require('express-validator');

//Controllers
const { CreatingMaquinaria, ListMaquinaria, UpdateMaquinaria, DeleteMaquinaria } = require("../../controllers/Transc/maquinaria.controller");


//Routes Controllers
maquinariaRoute.post('/', [
    check('Id_area', 'La area tiene que ser valida').isInt(),
    check('Id_tipo', 'La area tiene que ser valida').isInt(),
    check('Nombre_maquinaria', 'El nombre tiene que ser valido').not().isEmpty(),
    check('Estado', 'El estado tiene que ser valido').isInt()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        })
    }
    CreatingMaquinaria(req, res);
});

maquinariaRoute.get('/', ListMaquinaria);

maquinariaRoute.put('/:Id_maquinaria', [
    check('Id_area', 'La area tiene que ser valida').isInt(),
    check('Id_tipo', 'La area tiene que ser valida').isInt(),
    check('Nombre_maquinaria', 'El nombre tiene que ser valido').not().isEmpty(),
    check('Estado', 'El estado tiene que ser valido').isInt()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        })
    }
    UpdateMaquinaria(req, res);
});

maquinariaRoute.delete('/:Id_maquinaria', DeleteMaquinaria)

module.exports = maquinariaRoute;