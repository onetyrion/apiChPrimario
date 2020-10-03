
const { fallaComponente, componente, falla } = require("../../database/database");
const { validExist } = require("../Helpers");
//POST Create 
const creatingfallaComponente = async(req,res)=>{
    const errors = []
    const { Id_componente,Id_falla } = req.body;

    //VALID ID_COMPONENTE
    const componenteResult = await validExist("componente",Id_componente,"Id_componente","NOTEXIST");
    const fallaResult = await validExist("falla",Id_falla,"Id_falla","NOTEXIST");
    componenteResult != null && errors.push(componenteResult);
    fallaResult != null && errors.push(fallaResult);

    if (errors.length>0) {
        return res.status(422).json({errors});
    }
    try {

        let newfallaComponente = await fallaComponente.create({
            Id_componente,
            Id_falla,
        });
        if (newfallaComponente) {
            return res.json({
                message:'Falla Componente Created Successfully',
                data:newfallaComponente
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
const listfallaComponente = async(req,res)=>{
    try {
        const fallaComponenteList = await fallaComponente.findAll();
        res.json(fallaComponenteList);
    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       })         
    }
}
//PUT UPDATE 
const updatefallaComponente = async(req,res)=>{
    const Id_FallaComponente = req.params.Id_FallaComponente;
    const Id_componente = req.body.Id_componente;
    const Id_falla = req.body.Id_falla;
    const errors = [] 
    //console.log(req)
    try {
        //VALID Id_FallaComponente
        const fallaComponenteResult = await validExist("fallaComponente",Id_FallaComponente,"Id_fallaComponente","NOTEXIST")
        const componenteResult = await validExist("componente",Id_componente,"Id_componente","NOTEXIST");
        const fallaResult = await validExist("falla",Id_falla,"Id_falla","NOTEXIST");
        fallaComponenteResult != null && errors.push(fallaComponenteResult);
        componenteResult != null && errors.push(componenteResult);
        fallaResult != null && errors.push(fallaResult);
    
        if (errors.length>0) {
            return res.status(422).json({errors});
        }

        //UPDATE
        await fallaComponente.update(req.body,{
            where:{ Id_fallaComponente: Id_FallaComponente}
        });
        console.log("Falla Componente Modificada");
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
const deletefallaComponente = async(req,res)=>{
    if (Number.isInteger(req.params.Id_FallaComponente)) {
        return res.status(422).json({errores : "El id de la falla no es valido"})
    }
    const Id_FallaComponente = req.params.Id_FallaComponente;
    const errors = [];
    try {
        //VALID Id_FallaComponente
        const fallaComponenteResult = await validExist("fallaComponente",Id_FallaComponente,"Id_fallaComponente","NOTEXIST");
        fallaComponenteResult != null && errors.push(fallaComponenteResult);
    
        if (errors.length>0) {
            return res.status(422).json({errors});
        }
        
        await fallaComponente.destroy({
            where:{ Id_FallaComponente: Id_FallaComponente}
        });
        console.log(`Falla Mantencion Eliminada ${Id_FallaComponente}`);
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
    creatingfallaComponente,
    updatefallaComponente,
    deletefallaComponente,
    listfallaComponente
};