const usersRouter = require("express").Router();
const { check, validationResult} = require('express-validator');

//Controllers
const {CreatingUser,ListUsers,UpdateUser,DeleteUser} = require("../controllers/users.controller")
const { users} = require("../database/database");

//************************ */
//ROUTES 

usersRouter.post('/',[
    //Check Parameters on Body
    check('Rut','El Rut es Obligatorio').not().isEmpty(),
    check('Nombre','El Nombre es Obligatorio').not().isEmpty(),
    check('Apellidos','Los Apellidos son Obligatorios').not().isEmpty(),
    check('Correo_electronico','El Email es Obligatorio').isEmail(),
    check('Estado','El estado es Obligatorio').not().isEmpty(),
    check('Cargo','El cargo es Obligatorio').not().isEmpty(),
    check('Id_empresa','La Empresa es Obligatoria').not().isEmpty()
],async (req,res) => {
    //Check Errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errores : errors.array()})
    }
    //Load Controller
    CreatingUser(req,res);
}); 

usersRouter.get('/:userRUT',ListUsers)
usersRouter.get('/',ListUsers)

usersRouter.put('/:userRUT',[
    //Check Parameters on Body
    // check('Rut','El Rut es Obligatorio').not().isEmpty(),
    check('Nombre','El Nombre es Obligatorio').not().isEmpty(),
    check('Apellidos','Los Apellidos son Obligatorios').not().isEmpty(),
    check('Correo_electronico','El Email es Obligatorio').isEmail(),
    check('Estado','El estado es Obligatorio').not().isEmpty(),
    check('Cargo','El cargo es Obligatorio').not().isEmpty(),
    check('Id_empresa','La Empresa es Obligatoria').not().isEmpty()
],async (req,res) =>{
    //Check Errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array())
        return res.status(422).json({errors : errors.array()})
    }
    //Load Controller
    UpdateUser(req,res);
})

usersRouter.delete('/:userRUT',DeleteUser)

module.exports = usersRouter;