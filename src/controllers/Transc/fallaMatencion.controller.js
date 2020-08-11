
const { fallaMantencion, mantencion, falla } = require("../../database/database");

//POST Create 
const creatingfallaMantencion = async(req,res)=>{
    const { Id_mantencion,Id_falla } = req.body;

    //VALID ID_MANTENCION
    const IdMantencion = await mantencion.findAll({
        attributes: ['Id_mantencion'],
        where:{
            Id_mantencion:Id_mantencion
        }
    });
    if (typeof IdMantencion[0] == 'undefined') {
        return res.status(422).json({errores : "El id ingresado no esta registrado"})
    }
    //VALID ID_FALLA
    const IdFalla = await falla.findAll({
        attributes: ['Id_falla'], where:{Id_falla:Id_falla}
    });
    if (typeof IdFalla[0] == 'undefined') {
        return res.status(422).json({errores : "El id ingresado no esta registrado"})
    }
    
    try {

        let newfallaMantencion = await fallaMantencion.create({
            Id_mantencion,
            Id_falla,
        });
        if (newfallaMantencion) {
            return res.json({
                message:'Falla Mantencion Created Successfully',
                data:newfallaMantencion
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
const listFallaMatencion = async(req,res)=>{
    try {
        const fallaMantencionList = await fallaMantencion.findAll();
        res.json(fallaMantencionList);
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })         
    }
}
//PUT UPDATE 
const updateFallaMantencion = async(req,res)=>{
    const Id_FallaMantencion = req.params.Id_FallaMantencion;
    const Id_mantencion = req.body.Id_mantencion;
    const Id_falla = req.body.Id_falla;
    //console.log(req)
    try {
        //VALID ID_FALLAMANTENCION
        const IdfallaMantencion = await fallaMantencion.findAll({
            attributes: ['Id_FallaMantencion'],
            where:{
                Id_FallaMantencion:Id_FallaMantencion
            }
        });
        if (typeof IdfallaMantencion[0] == 'undefined') {
            return res.status(422).json({errores : "El id ingresado no esta registrado"})
        }
        //VALID ID_MANTENCION
        const IdMantencion = await mantencion.findAll({
            attributes: ['Id_mantencion'],
            where:{
                Id_mantencion:Id_mantencion
            }
        });
        if (typeof IdMantencion[0] == 'undefined') {
            return res.status(422).json({errores : "El id ingresado no esta registrado"})
        }
        //VALID ID_FALLA
        const IdFalla = await falla.findAll({
            attributes: ['Id_falla'], where:{Id_falla:Id_falla}
        });
        if (typeof IdFalla[0] == 'undefined') {
            return res.status(422).json({errores : "El id ingresado no esta registrado"})
        }

        //UPDATE
        await fallaMantencion.update(req.body,{
            where:{ Id_FallaMantencion: Id_FallaMantencion}
        });
        console.log("Falla Mantencion Modificada");
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
const deleteFallaMantencion = async(req,res)=>{
    if (Number.isInteger(req.params.Id_FallaMantencion)) {
        return res.status(422).json({errores : "El id de la falla no es valido"})
    }
    
    const Id_FallaMantencion = req.params.Id_FallaMantencion;
    try {
        //VALID ID_FALLAMANTENCION
        const IdfallaMantencion = await fallaMantencion.findAll({
            attributes: ['Id_FallaMantencion'],
            where:{
                Id_FallaMantencion:Id_FallaMantencion
            }
        });
        if (typeof IdfallaMantencion[0] == 'undefined') {
            return res.status(422).json({errores : "El id ingresado no esta registrado"})
        }
        
        await fallaMantencion.destroy({
            where:{ Id_FallaMantencion: Id_FallaMantencion}
        });
        console.log(`Falla Mantencion Eliminada ${Id_FallaMantencion}`);
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
    creatingfallaMantencion,
    updateFallaMantencion,
    deleteFallaMantencion,
    listFallaMatencion
};