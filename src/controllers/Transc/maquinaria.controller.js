
const { users, login, componente,maquinaria } = require("../../database/database");
const { validExist,validateTypes } = require("../Helpers");

//POST Create Maquinaria
const CreatingMaquinaria = async(req,res)=>{
    const { Id_area,Id_tipo,Nombre_maquinaria,Estado } = req.body;
    try {
        const errors = [];
        const areaResult = await validExist("areaProductiva",Id_area,"Id_area","NOTEXIST");
        const tipoResult = await validExist("tipoMaquinaria",Id_tipo,"Id_tipo","NOTEXIST");
        const EstadoResult = validateTypes(Estado,"boolean",1);
        const nombreResult = validateTypes(Nombre_maquinaria,"string",150);

        areaResult != null && errors.push(areaResult);
        tipoResult != null && errors.push(tipoResult);
        EstadoResult != null && errors.push(EstadoResult);
        nombreResult != null && errors.push(nombreResult);

        if (errors.length>0) {
            return res.status(422).json({errors});
        }

        let newUser = await maquinaria.create({
            Id_area,
            Nombre_maquinaria,
            Estado,
            Id_tipo
        });
        if (newUser) {
            return res.json({
                message:'Maquinaria Created Successfully',
                data:newUser
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

//Get List Maquinaria
const ListMaquinaria = async(req,res)=>{
    try {
        const List = await maquinaria.findAll();
        res.json(List);
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })         
    }
}
// PUT UPDATE Maquinaria
const UpdateMaquinaria = async(req,res)=>{
    const { Id_area, Nombre_maquinaria, Estado, Id_tipo } = req.body;
    const Id_maquinaria = req.params.Id_maquinaria
    const errors = [];
    try {
        //VALIDATION
        const areaResult = await validExist("areaProductiva",Id_area,"Id_area","NOTEXIST");
        const tipoResult = await validExist("tipoMaquinaria",Id_tipo,"Id_tipo","NOTEXIST");
        const maquinariaResult = await validExist("maquinaria",Id_maquinaria,"Id_maquinaria","NOTEXIST");
        const EstadoResult = validateTypes(Estado,"boolean",1);
        const nombreResult = validateTypes(Nombre_maquinaria,"string",150);

        areaResult != null && errors.push(areaResult);
        tipoResult != null && errors.push(tipoResult);
        EstadoResult != null && errors.push(EstadoResult);
        nombreResult != null && errors.push(nombreResult);
        maquinariaResult != null && errors.push(maquinariaResult);

        if (errors.length>0) {
            return res.status(422).json({errors});
        }

        await maquinaria.update(req.body,{
            where:{ Id_maquinaria: Id_maquinaria}
        });
        console.log("Maquinaria Modificado");
        res.json({success:'Se ha modificado'});
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })         
    }
}
//DELETE User
const DeleteMaquinaria = async(req,res)=>{
    if (isNaN(Number(req.params.Id_maquinaria))) {
        return res.status(422).json({error: "La ID ingresada no es válida",campo:req.params.Id_maquinaria})
    }
    try {
        const Id_maquinaria = req.params.Id_maquinaria; 
        
        // VALIDATION
        const errors = [];
        const maquinariaResult = await validExist("maquinaria",Id_maquinaria,"Id_maquinaria","NOTEXIST");
        maquinariaResult != null && errors.push(maquinariaResult);
        if (errors.length>0) {
            return res.status(422).json({errors});
        }

        await maquinaria.destroy({
            where:{ Id_maquinaria: req.params.Id_maquinaria}
        });
        console.log(`Maquinaria Eliminada ${req.params.Id_maquinaria}`);

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
    CreatingMaquinaria,
    UpdateMaquinaria,
    DeleteMaquinaria,
    ListMaquinaria
};