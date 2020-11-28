//dependences
const fallaRoute = require("express").Router();
const { check, validationResult } = require('express-validator');

//Controllers
const { listFalla, creatingFalla, updateFalla, deleteFalla } = require("../../controllers/Transc/falla.controller");
const { creatingfFallaC, updatefFallaC, deletefFallaC } = require("../../controllers/Transc/ffallaComponente.controller");


//Routes Controllers
fallaRoute.post('/', [
    check('Id_categoria', 'La id de la Categoria es Obligatoria').isInt(),
    check('Id_componente', 'La id del Componente es Obligatoria').isInt(),
    check('Id_tipo', 'El tipo de la falla es obligatoria').isInt(),
    check('Descripcion_causa', 'La Descripción es obligatoria').not().isEmpty(),
    check('Falla', 'La falla es obligatoria').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        })
    }
    creatingfFallaC(req, res);
});

fallaRoute.get('/', listFalla);

fallaRoute.put('/:Id_falla/:Id_componente', [
    // check('Id_componente', 'La id del Componente es Obligatoria').isInt(),
    check('newId_componente', 'La id del Componente es Obligatoria').isInt(),
    check('Id_categoria', 'La id de la Categoria es Obligatoria').isInt(),
    check('Id_tipo', 'El tipo de la falla es obligatoria').isInt(),
    check('Descripcion_causa', 'La Descripción es obligatoria').not().isEmpty(),
    check('Falla', 'La falla es obligatoria').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        })
    }
    updatefFallaC(req, res);
});

fallaRoute.delete('/:Id_falla/:Id_componente', deletefFallaC)

module.exports = fallaRoute;