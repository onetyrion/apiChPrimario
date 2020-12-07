//dependences
const authRoute = require("express").Router();
const { check, validationResult } = require('express-validator');

//Controllers
const { LoginAuth } = require("../controllers/auth.controller");

//Routes
authRoute.post('/', [
    check('Rut', 'El Rut es Obligatorio').not().isEmpty(),
    check('Password', 'La contraseña es Obligatoria').not().isEmpty(),
    check('Id_rol', 'El rol tiene que ser valido').isInt()
], async (req, res) => {
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errores: errors.array()
        })
    }
    LoginAuth(req, res);
});

module.exports = authRoute;