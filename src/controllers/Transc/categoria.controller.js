
const { categoria } = require("../../database/database");
// const { validExist,validateTypes } = require("../Helpers");

//Get List areaProductiva
const Listcategoria = async(req,res)=>{
    try {
        const List = await categoria.findAll();
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
    Listcategoria
};