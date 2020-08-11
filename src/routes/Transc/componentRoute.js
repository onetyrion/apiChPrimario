//dependences
const componentRoute = require("express").Router();
const { check, validationResult } = require('express-validator');

//Controllers
const { CreatingComponent, ListComponent, UpdateComponente, DeleteComponent } = require("../../controllers/component.controller");


//Routes Controllers
componentRoute.post('/', [
    check('Denominacion', 'El nombre es Obligatorio').not().isEmpty(),
    check('Id_maquinaria', 'la maquinaria no es valida').not().isEmpty(),
    check('Estado', 'El estado tiene que ser valido').isInt()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errores: errors.array()
        })
    }
    CreatingComponent(req, res);
});

componentRoute.get('/', ListComponent);

componentRoute.put('/:id_componente', [
    check('Denominacion', 'El nombre es Obligatorio').not().isEmpty(),
    check('Id_maquinaria', 'la maquinaria no es valida').not().isEmpty(),
    check('Estado', 'El estado tiene que ser valido').isInt()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errores: errors.array()
        })
    }
    UpdateComponente(req, res);
});

componentRoute.delete('/:id_componente', DeleteComponent)

module.exports = componentRoute;