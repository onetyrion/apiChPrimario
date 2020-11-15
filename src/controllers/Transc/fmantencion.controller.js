
const { creatingMantencion, updateMantencion, deleteMantencion } = require('./mantencion.controller');
const { creatingfallaMantencion, updateFallaMantencion, deleteFallaMantencion } = require ('./fallaMatencion.controller');
const { validExist } = require('../Helpers');
const { mantencion, fallaMantencion } = require('../../database/database');

//POST Create 
const creatingfMantencion = async(req,res)=>{
    const errors = [];
    const { Id_falla,Id_componente,Id_tipo,Id_evento } = req.body;
    try {
        const componentResult = await validExist("componente",Id_componente,"Id_componente","NOTEXIST");
        const tipoMantencionResult = await validExist("tipoMantencion",Id_tipo,"Id_tipo","NOTEXIST");
        const eventoResult = await validExist("evento",Id_evento,"Id_evento","NOTEXIST");
        const fallaResult = await validExist("falla",Id_falla,"Id_falla","NOTEXIST");

        componentResult != null && errors.push(componentResult);
        tipoMantencionResult != null && errors.push(tipoMantencionResult);
        eventoResult != null && errors.push(eventoResult);
        fallaResult != null && errors.push(fallaResult);
        if (errors.length>0) { return res.status(422).json({errors}); }

        const newMantencion = await creatingMantencion(req,res);
        //VALIDATION ID_MANTENCION
        const mantencionResult = await validExist("mantencion",newMantencion.Id_mantencion,"id_mantencion","NOTEXIST"); 
        mantencionResult != null && errors.push(mantencionResult); 
        if (errors.length>0) { return res.status(422).json({errors}); }

        const newfallamantencion = await creatingfallaMantencion({Id_mantencion:newMantencion.Id_mantencion,Id_falla:Id_falla},res);

        if (newMantencion) {
            res.json({
                message:'Mantencion Created Successfully',
                data:{newMantencion,newfallamantencion}
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       }) 
    }
}

const ListfMantencion = async(req,res)=>{
    try {
        // const MantencionList = await mantencion.findAll();
        const MantencionList = await mantencion.findAll({
            include:{model:fallaMantencion}
        });
        res.json(MantencionList);
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })         
    }
}

//PUT UPDATE 
const UpdatefMantencion = async(req,res)=>{
    const errors = [];
    const { Id_componente,Id_evento,Id_tipo,Id_falla } = req.body;
    if (Number.isInteger(req.params.Id_mantencion)) {
        return res.status(422).json({errores : "El id de la Mantneción no es valido"})
    }
    try {  
        //VALIDATION BODY & PARAMS
        const componentResult = await validExist("componente",Id_componente,"Id_componente","NOTEXIST");
        const tipoMantencionResult = await validExist("tipoMantencion",Id_tipo,"Id_tipo","NOTEXIST");
        const eventoResult = await validExist("evento",Id_evento,"Id_evento","NOTEXIST");
        const fallaResult = await validExist("falla",Id_falla,"Id_falla","NOTEXIST");
        componentResult != null && errors.push(componentResult);
        tipoMantencionResult != null && errors.push(tipoMantencionResult);
        eventoResult != null && errors.push(eventoResult);
        fallaResult != null && errors.push(fallaResult);
        if (errors.length>0) { return res.status(422).json({errors}); }

        //UPDATE REGISTER MANTENCION
        const newMantencion = await updateMantencion(req,res);
        //UPDATE FALLA MANTENCION
        const newfallamantencion = await updateFallaMantencion(req,res);
        console.log("newMantencion");

        if (newMantencion) {
            res.json({
                message:'Mantencion Updated Successfully',
                data:{newMantencion,newfallamantencion}
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })          
    }
}

const DeletefMantencion = async(req,res)=>{
    const errors = [];
    if (Number.isInteger(req.params.Id_FallaMantencion)) {
        return res.status(422).json({errores : "El id de la Mantneción no es valido"})
    }
    const Id_mantencion = req.params.Id_mantencion;

    try {  
        //VALIDATION BODY & PARAMS
        const mantencionResult = await validExist("mantencion",Id_mantencion,"Id_mantencion","NOTEXIST");
        const fallaMantencionResult = await validExist("fallaMantencion",Id_mantencion,"Id_mantencion","NOTEXIST");
        mantencionResult != null && errors.push(mantencionResult);
        fallaMantencionResult != null && errors.push(fallaMantencionResult);
        if (errors.length>0) { return res.status(422).json({errors}); }

        //UPDATE REGISTER MANTENCION
        const deletefMantencion = await deleteMantencion(Id_mantencion,res);
        //UPDATE FALLA MANTENCION
        console.log("DELETE MANTENCION");
        const deletefallamantencion = await deleteFallaMantencion(Id_mantencion,res);
        if (deletefMantencion) {
            res.json({
                message:'Mantencion DELETE Successfully',
                data:{deletefMantencion,deletefallamantencion}
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })          
    }
}

module.exports = {
    creatingfMantencion,
    ListfMantencion,
    UpdatefMantencion,
    DeletefMantencion
};