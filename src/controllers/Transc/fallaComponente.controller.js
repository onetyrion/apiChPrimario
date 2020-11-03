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
            Id_falla
        });
        if (newfallaComponente) {
            return newfallaComponente;
            // return res.json({
            //     message:'Falla Componente Created Successfully',
            //     data:newfallaComponente
            // })
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
        // const fallaComponenteList = await fallaComponente.findAll();
        const fallaComponenteList = await fallaComponente.findAll({ 
            include: {
                model:falla
            }
        })
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
    // const Id_FallaComponente = req.params.Id_FallaComponente;
    const errors = [] 
    const { newId_componente } = req.body;
    const { Id_falla,Id_componente} = req.params;
    //console.log(req)
    try {
        
        const componenteResult = await validExist("componente",Id_componente,"Id_componente","NOTEXIST");
        const newcomponenteResult = await validExist("componente",newId_componente,"Id_componente","NOTEXIST");
        const fallaResult = await validExist("falla",Id_falla,"Id_falla","NOTEXIST");

        newcomponenteResult != null && errors.push(newcomponenteResult);
        componenteResult != null && errors.push(componenteResult);
        fallaResult != null && errors.push(fallaResult);
    
        if (errors.length>0) {
            return res.status(422).json({errors});
        }
        
        //UPDATE
        const newFallaComponente = await fallaComponente.update({
            Id_componente:newId_componente,
            Id_falla
        },
            {where:{ Id_falla,Id_componente}}
        );
        if (newFallaComponente) {
            console.log("Falla Componente Modificada");
            return newFallaComponente;
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