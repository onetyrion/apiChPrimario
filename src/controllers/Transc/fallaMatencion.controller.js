
const { fallaMantencion, mantencion, falla } = require("../../database/database");
const { validExist } = require("../Helpers");

//POST Create 
const creatingfallaMantencion = async(req,res)=>{
    const { Id_mantencion,Id_falla } = req;
    try {
        let newfallaMantencion = await fallaMantencion.create({
            Id_mantencion,
            Id_falla,
        });
        if (newfallaMantencion) {
            return newfallaMantencion;
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
    const errors = []
    // const Id_FallaMantencion = req.params.Id_FallaMantencion;
    const Id_mantencion = req.params.Id_mantencion;
    const Id_falla = req.body.Id_falla;
    console.log("Id_mantencion");
    console.log(Id_mantencion);
    try {
        //VALID ID_FALLAMANTENCION
        // const fallaMantencionResult = await validExist("fallaMantencion",Id_FallaMantencion,"Id_fallaMantencion","NOTEXIST"); 
        const mantencionResult = await validExist("mantencion",Id_mantencion,"id_mantencion","NOTEXIST"); 
        const fallaResult = await validExist("falla",Id_falla,"Id_falla","NOTEXIST");

        // fallaMantencionResult != null && errors.push(fallaMantencionResult); 
        mantencionResult != null && errors.push(mantencionResult); 
        fallaResult != null && errors.push(fallaResult);

        if (errors.length>0) {
            return res.status(422).json({errors});
        }

        //UPDATE
        const newfallamantencion = await fallaMantencion.update({Id_falla},{
            where:{ Id_mantencion}
        });
        if (newfallamantencion) {
            console.log("Falla Mantencion Modificada");
            return newfallamantencion;
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
const deleteFallaMantencion = async(Id_mantencion,res)=>{
    
    // const Id_FallaMantencion = req.params.Id_FallaMantencion;
    try {
        //VALID ID_FALLAMANTENCION
        // const errors = []
        // const fallaMantencionResult = await validExist("fallaMantencion",Id_FallaMantencion,"Id_fallaMantencion","NOTEXIST");

        // fallaMantencionResult != null && errors.push(fallaMantencionResult); 

        // if (errors.length>0) {
        //     return res.status(422).json({errors});
        // }
        
        const deleteMantencion = await fallaMantencion.destroy({
            where:{ Id_mantencion}
        });
        if (deleteMantencion) {
            console.log(`Falla Mantencion Eliminada ${Id_mantencion}`);
            return deleteMantencion;
        }
        // res.json({success:'Se ha Eliminado'});
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