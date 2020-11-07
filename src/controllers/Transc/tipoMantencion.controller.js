
const { tipoMantencion } = require("../../database/database");
// const { validExist,validateTypes } = require("../Helpers");

//Get List tipoMantencion
const ListTipoMantencion = async(req,res)=>{
    try {
        const List = await tipoMantencion.findAll();
        res.json(List);
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })         
    }
}

module.exports = {
    ListTipoMantencion
};