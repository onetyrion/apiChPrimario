
const { login,users, rol } = require("../database/database");
const bcrypt = require('bcryptjs')

//POST Create User
const CreatingUser = async(req,res)=>{
    req.body.Contraseña=bcrypt.hashSync(req.body.Contraseña,10);
    const { Rut,Contraseña,Id_rol } = req.body;
    try {
        //VALID RUT ON TABLE USERS
        const rutUsers = await users.findAll({
            attributes: ['Rut'],
            where:{
                Rut:req.body.Rut
            }
        })
        if (typeof rutUsers[0] == 'undefined') {
            return res.status(422).json({errores : "El Rut ingresado no esta registrado"})
        }
        //VALID RUT ON TABLE LOGIN
        const rutLogin = await login.findAll({
            attributes: ['Rut'],
            where:{
                Rut:req.body.Rut
            }
        })       
        if (typeof rutLogin[0] != 'undefined') {
            return res.status(422).json({errores : "El Rut ingresado ya existe"})
        }
        //VALID Id_rol on Table ROL
        const rolUsers = await rol.findAll({
            where:{
                Id_rol:req.body.Id_rol
            }
        })
        if (typeof rolUsers[0] == 'undefined') {
            return res.status(422).json({errores : "El ROL ingresado no existe"})
        }

        let newLoginUser = await login.create({
            Rut,
            Contraseña,
            Id_rol:req.body.Id_rol
        });
        if (newLoginUser) {
            return res.json({
                message:'User to Login Created Successfully',
                data:newLoginUser
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
//Get List login
const ListUsers = async(req,res)=>{
    try {
        //USERID FROM LOGIN TOKEN
        console.log(req.userId)
        
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
    try {

        //VALID RUT ON TABLE USERS
        const rutUsers = await users.findAll({
            attributes: ['Rut'],
            where:{
                Rut:req.body.Rut
            }
        })
        if (typeof rutUsers[0] == 'undefined') {
            return res.status(422).json({errores : "El Rut ingresado no esta registrado"})
        }

        //VALID Id_rol on Table ROL
        const rolUsers = await rol.findAll({
            where:{
                Id_rol:req.body.Id_rol
            }
        })
        if (typeof rolUsers[0] == 'undefined') {
            return res.status(422).json({errores : "El ROL ingresado no existe"}) 
        }

        req.body.Contraseña=bcrypt.hashSync(req.body.Contraseña,10)
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
        const rutLogin = await login.findAll({
            where:{ 
                Rut: req.params.userRUT
            }
        });       
        console.log(rutLogin[0])
        if (typeof rutLogin[0] == 'undefined') {
            return res.status(422).json({errores : "El Rut ingresado no existe"})
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