//dependences
const fallaRoute = require("express").Router();
const { check, validationResult } = require('express-validator');

//Controllers
const { listFalla, creatingFalla, updateFalla, deleteFalla } = require("../../controllers/Transc/falla.controller");


//Routes Controllers
fallaRoute.post('/', [
    check('Id_categoria', 'La id de la matención es Obligatoria').not().isEmpty(),
    check('Id_tipo', 'La id de la falla es obligatoria').not().isEmpty(),
    check('Descripcion_causa', 'La id de la falla es obligatoria').not().isEmpty(),
    check('Falla', 'La id de la falla es obligatoria').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errores: errors.array()
        })
    }
    creatingFalla(req, res);
});

fallaRoute.get('/', listFalla);

fallaRoute.put('/:Id_falla', [
    check('Id_categoria', 'La id de la matención es Obligatoria').not().isEmpty(),
    check('Id_tipo', 'La id de la falla es obligatoria').not().isEmpty(),
    check('Descripcion_causa', 'La id de la falla es obligatoria').not().isEmpty(),
    check('Falla', 'La id de la falla es obligatoria').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errores: errors.array()
        })
    }
    updateFalla(req, res);
});

fallaRoute.delete('/:Id_falla', deleteFalla)

module.exports = fallaRoute;