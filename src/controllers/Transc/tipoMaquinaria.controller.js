
const { tipoMaquinaria } = require("../../database/database");
// const { validExist,validateTypes } = require("../Helpers");

//Get List tipoMaquinaria
const ListtipoMaquinaria = async(req,res)=>{
    try {
        const List = await tipoMaquinaria.findAll();
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
    ListtipoMaquinaria
};