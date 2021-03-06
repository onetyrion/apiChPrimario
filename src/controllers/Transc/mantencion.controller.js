const { mantencion,fallaMantencion } = require("../../database/database");
const { validExist } = require("../Helpers");

//POST Create 
const creatingMantencion = async(req,res)=>{
    const { Id_componente,Id_evento,Id_tipo,Fecha_mantencion,Cant_Evento_especial,Duracion,Descripcion,Horas_programadas,Horas_no_programadas,Cantidad_evProgramados,Cantidad_evNoProgramados,RFCA,Area,OT } = req.body;
    try {

        let newMantencion = await mantencion.create({
            Id_componente,
            Id_evento,
            Id_tipo,
            Fecha_mantencion,
            Cant_Evento_especial,
            Duracion,
            Descripcion,
            Horas_programadas,
            Horas_no_programadas,
            Cantidad_evProgramados,
            Cantidad_evNoProgramados,
            RFCA,
            Area,
            OT
        });
        if (newMantencion) {
            return newMantencion;
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
const listMantencion = async(req,res)=>{
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
const updateMantencion = async(req,res)=>{
    const { Id_componente,Id_evento,Id_tipo } = req.body;
    const id_mantencion = req.params.Id_mantencion;

    try {  
        const errors = []
        const mantencionResult = await validExist("mantencion",id_mantencion,"id_mantencion","NOTEXIST");
        const componentResult = await validExist("componente",Id_componente,"Id_componente","NOTEXIST");
        const tipoMantencionResult = await validExist("tipoMantencion",Id_tipo,"Id_tipo","NOTEXIST");
        const eventoResult = await validExist("evento",Id_evento,"Id_evento","NOTEXIST");

        mantencionResult != null && errors.push(mantencionResult);
        componentResult != null && errors.push(componentResult);
        tipoMantencionResult != null && errors.push(tipoMantencionResult);
        eventoResult != null && errors.push(eventoResult);

        if (errors.length>0) {
            return res.status(422).json({errors});
        }

        const newmantencion = await mantencion.update(req.body,{
            where:{ Id_mantencion: id_mantencion}
        });
        if (newmantencion) {
            console.log("Mantencion Modificada");
            return newmantencion;
        }
        // res.json({success:'Se ha modificado'});
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })          
    }
}
//DELETE
const deleteMantencion = async(Id_mantencion,res)=>{
    // if (Number.isInteger(req.params.Id_mantencion)) {
    //     return res.status(422).json({errors : "El id del mantencion no es valido"})
    // }
    // const id_mantencion = req.params.Id_mantencion;
    try {
        // const errors = []
        // const mantencionResult = await validExist("mantencion",id_mantencion,"id_mantencion","NOTEXIST"); 

        // mantencionResult != null && errors.push(mantencionResult); 

        // if (errors.length>0) {
        //     return res.status(422).json({errors});
        // }
        //VALID ID_FALLAMANTENCION
        // const IdfallaMantencion = await fallaMantencion.findAll({
        //     attributes: ['Id_FallaMantencion'],
        //     where:{
        //         Id_mantencion:id_mantencion
        //     }
        // });
        // if (typeof IdfallaMantencion[0] != 'undefined') {
        //     return res.status(422).json({errors : "El id ingresado ya esta registrado, primero elimine la falla asociada a la mantecion"})
        // }

        const deleteMantencion = await mantencion.destroy({
            where:{ Id_mantencion}
        });
        if (deleteMantencion) {
            console.log(`Mantencion Eliminada ${Id_mantencion}`);
            return deleteMantencion;
            // res.json({success:'Se ha Eliminado'});
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
    creatingMantencion,
    updateMantencion,
    deleteMantencion,
    listMantencion
};