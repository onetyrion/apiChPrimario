//dependences
const fUsuarioRoute = require("express").Router();
const { check, validationResult } = require('express-validator');

//Controllers
const { creatingfUsuario,deletefUsuario } = require("../../controllers/Transc/fUsuarios.controller");

// const { Rut,Nombre,Apellidos,Correo_electronico,Estado,Cargo,Id_empresa } = req.body;
//Routes Controllers
fUsuarioRoute.post('/', [
    check('Rut', 'El RUT es obligatorio').not().isEmpty(),
    check('Nombre', 'El nombre es Obligatorio').not().isEmpty(),
    check('Apellidos', 'Los apellidos son Obligatorios').not().isEmpty(),
    check('Correo_electronico', 'El correo electronico es Obligatorio').not().isEmpty(),
    check('Estado', 'El estado es Obligartorio').isInt(),
    check('Cargo', 'El cargo del empleado es obligatorio').not().isEmpty(),
    check('Id_empresa', 'las horas son obligatorias').isInt(),
    check('Id_rol', 'El Rol es obligatorio').isInt()
    // check('Password', 'la contraseña es Obligatoria').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        })
    }
    creatingfUsuario(req, res);
});
fUsuarioRoute.delete('/:userRUT', deletefUsuario)
module.exports = fUsuarioRoute;