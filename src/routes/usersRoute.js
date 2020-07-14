const usersRouter = require("express").Router();
const { check, validationResult} = require('express-validator');

//Controllers
const {CreatingUser,ListUsers,UpdateUser,DeleteUser} = require("../controllers/users.controller")
const { users} = require("../database/database");

//************************ */
//ROUTES 

usersRouter.post('/',[
    //Check Parameters
    check('Rut','El Rut es Obligatorio').not().isEmpty(),
    check('Nombre','El Nombre es Obligatoria').not().isEmpty(),
    check('Apellidos','Los Apellidos es Obligatoria').not().isEmpty(),
    check('Correo_electronico','El Email es Obligatoria').isEmail(),
    check('Estado','El estado es Obligatoria').not().isEmpty(),
    check('Cargo','El cargo es Obligatoria').not().isEmpty()

],async (req,res) => {

    //Check Errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errores : errors.array()})
    }

    //Load Controller
    CreatingUser(req,res);
}); 

usersRouter.get('/',ListUsers)

usersRouter.put('/:userRUT',UpdateUser)

usersRouter.delete('/:userRUT',DeleteUser)

module.exports = usersRouter;