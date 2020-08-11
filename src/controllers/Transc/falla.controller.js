
const { fallaMantencion, mantencion, falla, categoria, tipoFalla } = require("../../database/database");

//POST Create 
const creatingFalla = async(req,res)=>{
    const { Id_categoria,Id_tipo,Descripcion_causa,Falla } = req.body;

    //VALID ID_CATEGORIA
    const IdCategoria = await categoria.findAll({
        attributes: ['Id_categoria'], where:{Id_categoria:Id_categoria}
    });
    if (typeof IdCategoria[0] == 'undefined') {
        return res.status(422).json({errores : "La categoria no está registrada"})
    }
    //VALID ID_TIPO
    const IdTipoFalla = await tipoFalla.findAll({
        attributes: ['Id_tipo'], where:{Id_tipo:Id_tipo}
    });
    if (typeof IdTipoFalla[0] == 'undefined') {
        return res.status(422).json({errores : "El tipo de falla no está registrada"})
    }
    
    try {

        let newFalla = await falla.create({
            Id_categoria,
            Id_tipo,
            Descripcion_causa,
            Falla
        });
        if (newFalla) {
            return res.json({
                message:'Falla Mantencion Created Successfully',
                data:newFalla
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
const listFalla = async(req,res)=>{
    try {
        const fallaList = await falla.findAll();
        res.json(fallaList);
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })         
    }
}
//PUT UPDATE 
const updateFalla = async(req,res)=>{
    const { Id_categoria,Id_tipo } = req.body;
    const Id_falla = req.params.Id_falla;
    //console.log(req)
    try {
        //VALID ID_FALLA
        const Idfalla = await falla.findAll({
            attributes: ['Id_falla'],
            where:{
                Id_falla:Id_falla
            }
        });
        if (typeof Idfalla[0] == 'undefined') {
            return res.status(422).json({errores : "El id ingresado no esta registrado"})
        }
        //VALID ID_CATEGORIA
        const IdCategoria = await categoria.findAll({
            attributes: ['Id_categoria'], where:{Id_categoria:Id_categoria}
        });
        if (typeof IdCategoria[0] == 'undefined') {
            return res.status(422).json({errores : "La categoria no está registrada"})
        }
        //VALID ID_TIPO
        const IdTipoFalla = await tipoFalla.findAll({
            attributes: ['Id_tipo'], where:{Id_tipo:Id_tipo}
        });
        if (typeof IdTipoFalla[0] == 'undefined') {
            return res.status(422).json({errores : "El tipo de falla no está registrada"})
        }

        //UPDATE
        await falla.update(req.body,{
            where:{ Id_falla: Id_falla}
        });
        console.log("Falla Modificada");
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
const deleteFalla = async(req,res)=>{
    if (Number.isInteger(req.params.Id_falla)) {
        return res.status(422).json({errores : "El id de la falla no es valido"})
    }
    const Id_falla = req.params.Id_falla;

    try {
        //VALID ID_FALLA
        const Idfalla = await falla.findAll({
            attributes: ['Id_falla'],
            where:{
                Id_falla:Id_falla
            }
        });
        if (typeof Idfalla[0] == 'undefined') {
            return res.status(422).json({errores : "El id ingresado no esta registrado"})
        }
        //VALID ID_FALLAMANTENCION
        const IdfallaMantencion = await fallaMantencion.findAll({
            attributes: ['Id_FallaMantencion'],
            where:{
                Id_falla:Id_falla
            }
        });
        if (typeof IdfallaMantencion[0] != 'undefined') {
            return res.status(422).json({errores : "La falla está asociada a un falla-mantencion"})
        }
        
        
        await fallaMantencion.destroy({
            where:{ Id_falla: Id_falla}
        });
        console.log(`Falla Eliminada ${Id_falla}`);
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
    updateFalla,
    deleteFalla,
    listFalla,
    creatingFalla
};