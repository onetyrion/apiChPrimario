
const { mantencion,fallaMantencion } = require("../../database/database");

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
    const id_mantencion = req.params.Id_mantencion;
    //console.log(req)
    try {
        //VALID EXIST ON TABLE 
        const IdMantencion = await mantencion.findAll({
            attributes: ['Id_mantencion'],
            where:{
                Id_mantencion:id_mantencion
            }
        });
        if (typeof IdMantencion[0] == 'undefined') {
            return res.status(422).json({errores : "El id ingresado no esta registrado"})
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
        //VALID EXIST ON TABLE mantencion
        const IdMantencion = await mantencion.findAll({
            attributes: ['Id_mantencion'],
            where:{
                Id_mantencion:id_mantencion
            }
        });
        if (typeof IdMantencion[0] == 'undefined') {
            return res.status(422).json({errores : "La mantencion ingresada no esta registrada"})
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