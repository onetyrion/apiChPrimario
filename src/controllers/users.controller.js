
const { users, login } = require("../database/database");

//POST Create User
const CreatingUser = async(req,res)=>{
    console.log(req.body);
    const { Rut,Nombre,Apellidos,Correo_electronico,Estado,Cargo } = req.body;
    try {
        //VALID RUT ON TABLE USERS
        const rutUsers = await users.findAll({
            attributes: ['Rut'],
            where:{
                Rut:req.body.Rut
            }
        })
        if (typeof rutUsers[0] != 'undefined') {
            return res.status(422).json({errores : "El Rut ingresado ya esta registrado"})
        }

        let newUser = await users.create({
            Rut,
            Nombre,
            Apellidos,
            Correo_electronico,
            Estado,
            Cargo
        });
        if (newUser) {
            return res.json({
                message:'User Created Successfully',
                data:newUser
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

//Get List Users
const ListUsers = async(req,res)=>{
    try {
        const UsuariosList = await users.findAll();
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
        console.log(req.body.userRUT)
        //VALID RUT ON TABLE USERS
        const rutUsers = await users.findAll({
            attributes: ['Rut'],
            where:{
                Rut:req.params.userRUT
            }
        })
        if (typeof rutUsers[0] == 'undefined') {
            return res.status(422).json({errores : "El Rut ingresado no esta registrado"})
        }
        await users.update(req.body,{
            where:{ rut: req.params.userRUT}
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
        //VALID RUT ON TABLE USERS
        const rutUsers = await users.findAll({
            attributes: ['Rut'],
            where:{
                Rut:req.params.userRUT
            }
        })
        console.log(req.params)
        if (typeof rutUsers[0] == 'undefined') {
            return res.status(422).json({errores : "El Rut ingresado no esta registrado"})
        }
        // //VALID RUT ON TABLE LOGIN
        const rutLogin = await login.findAll({
            where:{ 
                Rut: req.params.userRUT
            }
        });       
        console.log(rutLogin[0])
        if (typeof rutLogin[0] != 'undefined') {
            return res.status(422).json({errores : "Primero borre el usuario"})
        }
        
        await users.destroy({
            where:{ rut: req.params.userRUT}
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