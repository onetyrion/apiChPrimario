
const { programaMantencion } = require("../../database/database");
const { validExist, validateTypes } = require("../Helpers");

//POST Create 
const creatingPMantencion = async(req,res)=>{
    const { Meta, Anio, Id_maquinaria, Id_kpi } = req.body;
    try {

        let newPMantencion = await programaMantencion.create({
            Meta,
            Anio,
            Id_maquinaria,
            Id_kpi
        });
        if (newPMantencion) {
            console.log("Mantencion Modificada");
            res.json({success:'Se ha Añadido',newPMantencion});
        }
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       }) 
    }
}

//Get List 
const ListProgramaMantencion = async(req,res)=>{
    try {
        const PMantencionList = await programaMantencion.findAll();
        // const PMantencionList = await programaMantencion.findAll({
        //     include:{model:fallaMantencion}
        // });
        res.json(PMantencionList);
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })         
    }
}
//PUT UPDATE 
const updatePMantencion = async(req,res)=>{
    const errors = []
    const { Id_maquinaria, Id_kpi } = req.body;
    const id_ProgramaMantencion = req.params.id_ProgramaMantencion; 

    try {  
        const idmaquinariaResult = await validExist("maquinaria",Id_maquinaria,"Id_maquinaria","NOTEXIST");
        const idkpiResult = await validExist("Indicador",Id_kpi,"Id_kpi","NOTEXIST");

        idmaquinariaResult != null && errors.push(idmaquinariaResult);
        idkpiResult != null && errors.push(idkpiResult);

        if (errors.length>0) {
            return res.status(422).json({errors});
        }

        await programaMantencion.update(req.body,{
            where:{ id_ProgramaMantencion }
        });
        console.log("PMantencion Modificada");
        res.json({success:'Se ha modificado'});
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })          
    }
}
//DELETE
const DeletePMantencion = async(req,res)=>{
    if (Number.isInteger(req.params.Id_mantencion)) {
        return res.status(422).json({errors : "El id de la meta no es valida"})
    }
    const id_ProgramaMantencion = req.params.id_ProgramaMantencion; 
    try {
        const errors = []
        const pmantencionResult = await validExist("programaMantencion",id_ProgramaMantencion,"id_ProgramaMantencion","NOTEXIST"); 

        pmantencionResult != null && errors.push(pmantencionResult); 

        if (errors.length>0) {
            return res.status(422).json({errors});
        }

        await programaMantencion.destroy({
            where:{ id_ProgramaMantencion }
        });
        console.log(`Mantencion Eliminada ${id_ProgramaMantencion}`);
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
    creatingPMantencion,
    updatePMantencion,
    DeletePMantencion,
    ListProgramaMantencion
};