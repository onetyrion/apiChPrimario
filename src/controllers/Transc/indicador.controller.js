
const { indicador } = require("../../database/database");
// const { validExist,validateTypes } = require("../Helpers");

//Get List areaProductiva
const ListIndicador = async(req,res)=>{
    try {
        const List = await indicador.findAll();
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
    ListIndicador
};