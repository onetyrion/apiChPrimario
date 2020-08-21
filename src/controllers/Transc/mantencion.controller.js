
const { mantencion,fallaMantencion } = require("../../database/database");
const { validExist } = require("../Helpers");

//POST Create 
const creatingMantencion = async(req,res)=>{
    const { Id_componente,Id_evento,Id_tipo,Fecha_mantencion,Cant_Evento_especial,Duracion,Descripcion,Horas_programadas,Horas_no_programadas,Cantidad_evProgramados,Cantidad_evNoProgramados,RFCA,Area,OT } = req.body;
    try {

        const errors = []
        const componentResult = await validExist("componente",Id_componente,"Id_componente");
        const tipoMantencionResult = await validExist("tipoMantencion",Id_tipo,"Id_tipo");
        const eventoResult = await validExist("evento",Id_evento,"Id_evento");

        componentResult != null ? errors.push(componentResult) : null;
        tipoMantencionResult != null ? errors.push(tipoMantencionResult) : null;
        eventoResult != null ? errors.push(eventoResult) : null;

        if (errors.length>0) {
            return res.status(422).json({errors});
        }

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
            return res.json({
                message:'Mantencion Created Successfully',
                data:newMantencion
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

//Get List 
const ListMantencion = async(req,res)=>{
    try {
        const MantencionList = await mantencion.findAll();
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
const UpdateMantencion = async(req,res)=>{
    const { Id_componente,Id_evento,Id_tipo } = req.body;
    const id_mantencion = req.params.Id_mantencion;

    try {  
        const errors = []
        const mantencionResult = await validExist("mantencion",id_mantencion,"id_mantencion");
        const componentResult = await validExist("componente",Id_componente,"Id_componente");
        const tipoMantencionResult = await validExist("tipoMantencion",Id_tipo,"Id_tipo");
        const eventoResult = await validExist("evento",Id_evento,"Id_evento");

        mantencionResult != null ? errors.push(mantencionResult) : null;
        componentResult != null ? errors.push(componentResult) : null;
        tipoMantencionResult != null ? errors.push(tipoMantencionResult) : null;
        eventoResult != null ? errors.push(eventoResult) : null;

        if (errors.length>0) {
            return res.status(422).json({errors});
        }

        await mantencion.update(req.body,{
            where:{ Id_mantencion: id_mantencion}
        });
        console.log("Mantencion Modificada");
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
const DeleteMantencion = async(req,res)=>{
    if (Number.isInteger(req.params.Id_mantencion)) {
        return res.status(422).json({errores : "El id del mantencion no es valido"})
    }
    const id_mantencion = req.params.Id_mantencion;
    try {
        const errors = []
        const mantencionResult = await validExist("mantencion",id_mantencion,"id_mantencion"); 

        mantencionResult != null ? errors.push(mantencionResult) : null; 

        if (errors.length>0) {
            return res.status(422).json({errors});
        }
        //VALID ID_FALLAMANTENCION
        const IdfallaMantencion = await fallaMantencion.findAll({
            attributes: ['Id_FallaMantencion'],
            where:{
                Id_mantencion:id_mantencion
            }
        });
        if (typeof IdfallaMantencion[0] != 'undefined') {
            return res.status(422).json({errores : "El id ingresado ya esta registrado, primero elimine la falla asociada a la mantecion"})
        }

        await mantencion.destroy({
            where:{ Id_mantencion: id_mantencion}
        });
        console.log(`Mantencion Eliminada ${id_mantencion}`);
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
    creatingMantencion,
    UpdateMantencion,
    DeleteMantencion,
    ListMantencion
};