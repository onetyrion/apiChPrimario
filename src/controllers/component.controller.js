
const { componente } = require("../database/database");
const { validExist,validateTypes } = require("./Helpers");

//POST Create Component
const CreatingComponent = async(req,res)=>{
    const { Denominacion,Id_maquinaria,Estado } = req.body;
    try {
        const errors = [];
        const maquinariaResult = await validExist("maquinaria",Id_maquinaria,"Id_maquinaria","NOTEXIST");
        const estadoResult = validateTypes(Estado,"boolean");
        maquinariaResult != null && errors.push(maquinariaResult);
        estadoResult != null && errors.push(estadoResult);

        if (errors.length>0) {
            return res.status(422).json({errors});
        }

        let newUser = await componente.create({
            Denominacion,
            Id_maquinaria,
            Estado
        });
        if (newUser) {
            return res.json({
                message:'Component Created Successfully',
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

//Get List Component
const ListComponent = async(req,res)=>{
    try {
        const ComponentesList = await componente.findAll();
        res.json(ComponentesList);
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })         
    }
}
//PUT UPDATE Componentes
const UpdateComponente = async(req,res)=>{
    const { Denominacion,Id_maquinaria,Estado } = req.body;
    const Id_componente = req.params.Id_componente
    try {
        //VALIDATION
        const errors = [];
        const maquinariaResult = await validExist("maquinaria",Id_maquinaria,"Id_maquinaria","NOTEXIST");
        const componentResult = await validExist("componente",Id_componente,"Id_componente","NOTEXIST");
        maquinariaResult != null && errors.push(maquinariaResult);
        componentResult != null && errors.push(componentResult);
        if (errors.length>0) {
            return res.status(422).json({errors});
        }

        await componente.update(req.body,{
            where:{ Id_componente: Id_componente}
        });
        console.log("Componente Modificado");
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
const DeleteComponent = async(req,res)=>{
    if (Number.isInteger(req.params.Id_componente)) {
        return res.status(422).json({errores : "El id del componente no es valido"})
    }
    try {
        const Id_componente = req.params.Id_componente; 
        // VALIDATION
        const errors = [];
        const componentResult = await validExist("componente",Id_componente,"Id_componente","NOTEXIST");
        componentResult != null && errors.push(componentResult);
        
        if (errors.length>0) {
            return res.status(422).json({errors});
        }

        await componente.destroy({
            where:{ Id_componente: req.params.Id_componente}
        });
        console.log(`Componente Eliminado ${req.params.Id_componente}`);

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
    CreatingComponent,
    UpdateComponente,
    DeleteComponent,
    ListComponent
};