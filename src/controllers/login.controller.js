
const { login } = require("../database/database");
const bcrypt = require('bcryptjs');
const { validExist,format_rutify } = require("./Helpers");

//POST Create User
const CreatingUser = async(req,res)=>{
    // default password
    if (req.body.Password) {
        req.body.Password=bcrypt.hashSync(req.body.Password,10);
    }else{
        req.body.Password=bcrypt.hashSync("123456",10);
    }
    const { Rut,Password,Id_rol } = req.body;
    try {
        // const errors = []
        // const loginResult = await validExist("login",Rut,"Rut","EXIST");
        // const usersResult = await validExist("users",Rut,"Rut","NOTEXIST");
        // const rolResult = await validExist("rol",Id_rol,"Id_rol","NOTEXIST");

        // loginResult != null && errors.push(loginResult);
        // usersResult != null && errors.push(usersResult);
        // rolResult != null && errors.push(rolResult);
        
        // // if (errors.length>0) {
        // //     return res.status(422).json({errors});
        // // }

        let newLoginUser = await login.create({
            Rut,
            Password,
            Id_rol
        });
        if (newLoginUser) {
            return newLoginUser;
        }
    } catch (error) {
        return error;
    }
}
//Get List login
const ListUsers = async(req,res)=>{
    try {
        const UsuariosList = await login.findAll();
        console.log("Usuarios List");
        res.json(UsuariosList);
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })         
    }
}
//PUT UPDATE Users
const UpdateUser = async(req,res)=>{
    
    const Rut = format_rutify(req.params.userRUT);
    if (!Rut) {
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })  
    }
    console.log(req.params.userRUT)
    try {
        const errors = []
        const usersResult = await validExist("users",Rut,"Rut","NOTEXIST");
        const loginResult = await validExist("login",Rut,"Rut","NOTEXIST");
        usersResult != null && errors.push(usersResult);
        loginResult != null && errors.push(loginResult);
        if (errors.length>0) {
            return res.status(422).json({errors});
        }

        req.body.Password=bcrypt.hashSync(req.body.Password,10)
        await login.update(req.body,{
            where:{ Rut: req.params.userRUT}
        });
        console.log("Usuario Modificado");
        res.json({success:'Se ha modificado'});
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })         
    }
}
//DELETE User
const DeleteUser = async(req,res)=>{
    try {
        // //VALID RUT ON TABLE LOGIN
        const rutLogin = await login.findAll({ where:{  Rut: req.params.userRUT }});      
        if (typeof rutLogin[0] == 'undefined') {
            return res.status(422).json({errors : "El Rut ingresado no existe"})
        }
        await login.destroy({
            where:{ 
                Rut: req.params.userRUT
            }
        });
        console.log(`Usuario Eliminado ${req.params.userRUT}`);
        res.json({success:'Se ha Eliminado'});
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })         
    }
}
module.exports = {
    CreatingUser,
    ListUsers,
    UpdateUser,
    DeleteUser
};