
const { falla } = require("../../database/database");
const { validExist, validateTypes } = require("../Helpers");

//POST Create 
const creatingFalla = async(req,res)=>{
    const { Id_categoria,Id_tipo,Descripcion_causa,Falla } = req.body;
    const errors = []

    const categoriaResult = await validExist("categoria",Id_categoria,"Id_categoria","NOTEXIST");
    const tipoFallaResult = await validExist("tipoFalla",Id_tipo,"Id_tipo","NOTEXIST");
    const fallaEstadoResult = await validateTypes(Falla,"boolean")

    categoriaResult != null && errors.push(categoriaResult);
    tipoFallaResult != null && errors.push(tipoFallaResult);
    fallaEstadoResult != null && errors.push(fallaEstadoResult);

    if (errors.length>0) {
        return res.status(422).json({errors});
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
    const Falla = req.body.Falla;
    //console.log(req)
    try {
        const errors = []

        const fallaResult = await validExist("falla",Id_falla,"Id_falla","NOTEXIST");
        const categoriaResult = await validExist("categoria",Id_categoria,"Id_categoria","NOTEXIST");
        const tipoFallaResult = await validExist("tipoFalla",Id_tipo,"Id_tipo","NOTEXIST");
        const fallaEstadoResult = await validateTypes(Falla,"boolean")
        
        fallaResult != null && errors.push(fallaResult);
        categoriaResult != null && errors.push(categoriaResult);
        tipoFallaResult != null && errors.push(tipoFallaResult);
        fallaEstadoResult != null && errors.push(fallaEstadoResult);

        if (errors.length>0) {
            return res.status(422).json({errors});
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
    const errors = [];
    if (Number.isInteger(req.params.Id_falla)) {
        return res.status(422).json({errores : "El id de la falla no es valido"});
    }
    const Id_falla = req.params.Id_falla;

    try {
        const fallaResult = await validExist("falla",Id_falla,"Id_falla","NOTEXIST");
        const fallaMantencionResult = await validExist("fallaMantencion",Id_falla,"Id_falla","EXIST");

        fallaResult != null && errors.push(fallaResult);
        fallaMantencionResult != null && errors.push(fallaMantencionResult);

        if (errors.length>0) {
            return res.status(422).json({errors});
        }
        
        await falla.destroy({
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