
const { users, login } = require("../database/database");
const { validExist } = require("./Helpers");

//POST Create User
const CreatingUser = async(req,res)=>{
    const { Rut,Nombre,Apellidos,Correo_electronico,Estado,Cargo,Id_empresa } = req.body;
    try {
        //VALID RUT ON TABLE USERS
        const rutUsers = await users.findAll({ where:{ Rut:Rut }});

        if (typeof rutUsers[0] !== 'undefined') {
            return res.status(422).json({errores : "El Rut ingresado ya esta registrado"})
        }

        let newUser = await users.create({
            Rut,
            Nombre,
            Apellidos,
            Correo_electronico,
            Estado,
            Cargo,
            Id_empresa
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
        const Rut = req.params.userRUT;
        const errors = []
        const usersResult = await validExist("users",Rut,"Rut");
        usersResult != null ? errors.push(usersResult) : null;
        if (errors.length>0) {
            return res.status(422).json({errors});
        }

        await users.update(req.body,{
            where:{ rut:Rut}
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
        const Rut = req.params.userRUT;

        const errors = []
        const loginResult = await validExist("login",Rut,"Rut");
        const usersResult = await validExist("users",Rut,"Rut");

        loginResult != null ? errors.push(loginResult) : null;
        usersResult != null ? errors.push(usersResult) : null;
        
        if (errors.length>0) {
            return res.status(422).json({errors});
        }
        
        await users.destroy({
            where:{ rut: Rut}
        });
        console.log(`Usuario Eliminado ${Rut}`);
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