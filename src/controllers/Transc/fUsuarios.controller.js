// const { creatingMantencion } = require('./mantencion.controller');
// const { creatingfallaMantencion } = require ('./fallaMatencion.controller');
const { validExist } = require('../Helpers');
const { CreatingUser } = require('../users.controller');
const { CreatingUser:CreatingUserLogin}  = require('../login.controller');
const { users, login } = require('../../database/database');

//POST Create 
const creatingfUsuario = async(req,res)=>{
    const errors = []
    const { Rut,Id_rol} = req.body;
    try {
        const rutUsers = await users.findAll({ where:{ Rut:Rut }});

        if (typeof rutUsers[0] !== 'undefined') {
            return res.status(422).json({errors : "El Rut ingresado ya esta registrado"})
        }
        const loginResult = await validExist("login",Rut,"Rut","EXIST");
        const rolResult = await validExist("rol",Id_rol,"Id_rol","NOTEXIST");

        loginResult != null && errors.push(loginResult);
        rolResult != null && errors.push(rolResult);
        if (errors.length>0) { return res.status(422).json({errors}); }

        //CREATING ON TABLE USUARIO
        const newUser = await CreatingUser(req,res);
        
        const usersResult = await validExist("users",Rut,"Rut","NOTEXIST");
        usersResult != null && errors.push(usersResult);
        if (errors.length>0) { return res.status(422).json({errors}); }
        //CREATING ON TABLE LOGIN
        const newUserLogin = await CreatingUserLogin(req,res);
        if (newUserLogin) {
            return res.json({
                message:'User Created Successfully',
                data:{newUser,newUserLogin}
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       }) 
    }
}

const deletefUsuario = async(req,res)=> {
    const errors = [];
    const Rut = req.params.userRUT;
    try {
        const loginResult = await validExist("login",Rut,"Rut","NOTEXIST");
        const usersResult = await validExist("users",Rut,"Rut","NOTEXIST");
        usersResult != null && errors.push(usersResult);
        loginResult != null && errors.push(loginResult);
        if (errors.length>0) { return res.status(422).json({errors}); }

        await users.destroy({ where:{ rut: Rut} });
        await login.destroy({ where:{ rut: Rut} });
        
        return res.json({
            message:'User DELETE Successfully',
            data:Rut
        })

    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       }) 
    }
}
module.exports = {
    creatingfUsuario,
    deletefUsuario
};