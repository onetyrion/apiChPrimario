//dependences
const fallaComponenteRoute = require("express").Router();
const { check, validationResult } = require('express-validator');

//Controllers
const {  listfallaComponente, creatingfallaComponente,updatefallaComponente,deletefallaComponente } = require("../../controllers/Transc/fallaComponente.controller");


//Routes Controllers
fallaComponenteRoute.post('/', [
    check('Id_componente', 'La id de la matención es Obligatoria').isInt(),
    check('Id_falla', 'La id de la falla es obligatoria').isInt(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        })
    }
    creatingfallaComponente(req, res);
});

fallaComponenteRoute.get('/', listfallaComponente);

fallaComponenteRoute.put('/:Id_FallaComponente', [
    check('Id_componente', 'La id del componente es Obligatorio').isInt(),
    check('Id_falla', 'La id de la falla es obligatoria').isInt(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        })
    }
    updatefallaComponente(req, res);
});

fallaComponenteRoute.delete('/:Id_FallaComponente', deletefallaComponente)

module.exports = fallaComponenteRoute;