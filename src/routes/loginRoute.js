//dependences
const loginRoute = require("express").Router();
const { check, validationResult } = require('express-validator');

//Controllers
const { CreatingUser, ListUsers, UpdateUser, DeleteUser } = require("../controllers/login.controller");


//Routes Controllers
loginRoute.post('/', [
    check('Rut', 'El Rut es Obligatorio').not().isEmpty(),
    check('pass', 'La contraseña es Obligatoria').not().isEmpty(),
    check('Id_rol', 'El rol tiene que ser valido').isInt()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errores: errors.array()
        })
    }
    CreatingUser(req, res);
});

loginRoute.get('/', ListUsers)

loginRoute.put('/:userRUT', [
    check('Rut', 'El Rut es Obligatorio').not().isEmpty(),
    check('pass', 'La contraseña es Obligatoria').not().isEmpty(),
    check('Id_rol', 'El rol tiene que ser valido').isInt()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errores: errors.array()
        })
    }
    UpdateUser(req, res);
});

loginRoute.delete('/:userRUT', DeleteUser)

module.exports = loginRoute;