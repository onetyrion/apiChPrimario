// const { creatingMantencion } = require('./mantencion.controller');
// const { creatingfallaMantencion } = require ('./fallaMatencion.controller');
const { validExist,validateTypes } = require('../Helpers');
const { creatingFalla, updateFalla } = require('./falla.controller');
const { creatingfallaComponente, updatefallaComponente } = require('./fallaComponente.controller');
const { falla, componente, fallaComponente } = require('../../database/database');

//POST Create 
const creatingfFallaC = async(req,res)=>{
    const errors = []
    const { Id_categoria, Id_componente} = req.body;
    try {
        const categoriaResult = await validExist("categoria",Id_categoria,"Id_categoria","NOTEXIST");
        // const tipoFallaResult = await validExist("tipoFalla",Id_tipo,"Id_tipo","NOTEXIST");
        const componenteResult = await validExist("componente",Id_componente,"Id_componente","NOTEXIST");

        categoriaResult != null && errors.push(categoriaResult);
        // tipoFallaResult != null && errors.push(tipoFallaResult);
        componenteResult != null && errors.push(componenteResult);
        if (errors.length>0) { return res.status(422).json({errors}); }

        //CREATING ON TABLE USUARIO
        const newFalla = await creatingFalla(req,res);
        
        const fallaResult = await validExist("falla",newFalla.Id_falla,"Id_falla","NOTEXIST");
        fallaResult != null && errors.push(fallaResult);
        if (errors.length>0) { return res.status(422).json({errors}); }

        req.body.Id_falla = newFalla.Id_falla;
        
        //CREATING ON TABLE Falla_Componentes
        const newFallaComponente = await creatingfallaComponente(req,res);

        if (newFallaComponente) {
            return res.json({
                message:'User Created Successfully',
                data:{newFalla,newFallaComponente}
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

const updatefFallaC = async(req,res)=>{
    const errors = []
    const { Id_categoria, newId_componente} = req.body;
    const { Id_falla,Id_componente } = req.params;
    const idComponentesResult = await validateTypes(Id_componente,"number");
    const idFallaResult = await validateTypes(Id_falla,"number");
    
    idComponentesResult != null && errors.push(idComponentesResult);
    idFallaResult != null && errors.push(idFallaResult);
    
    if (errors.length>0) { return res.status(422).json({errors}); }
    
    try {
        const categoriaResult = await validExist("categoria",Id_categoria,"Id_categoria","NOTEXIST");
        // const tipoFallaResult = await validExist("tipoFalla",Id_tipo,"Id_tipo","NOTEXIST");
        const componenteResult = await validExist("componente",Id_componente,"Id_componente","NOTEXIST");
        const newcomponenteResult = await validExist("componente",newId_componente,"Id_componente","NOTEXIST");
        const fallaResult = await validExist("falla",Id_falla,"Id_falla","NOTEXIST");

        categoriaResult != null && errors.push(categoriaResult);
        // tipoFallaResult != null && errors.push(tipoFallaResult);
        componenteResult != null && errors.push(componenteResult);
        newcomponenteResult != null && errors.push(newcomponenteResult);
        fallaResult != null && errors.push(fallaResult);
        if (errors.length>0) { return res.status(422).json({errors}); }
    
        const fallaComponenteResult = await fallaComponente.findAll({
            where:{
                Id_componente,Id_falla
            }
        })
        // console.lo/g(fallaComponenteResult[0]);
        if (!fallaComponenteResult[0]) {
            return res.status(422).json({error:"No existe ese registro en falla_componente"});
        }        

        //CREATING ON TABLE falla
        const newFalla = await updateFalla(req,res);
        //CREATING ON TABLE Falla_Componentes
        const newFallaComponente = await updatefallaComponente(req,res);

        if (newFallaComponente) {
            return res.json({
                message:'Falla Created Successfully',
                data:{newFalla,newFallaComponente}
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

const deletefFallaC = async(req,res)=> {
    const errors = [];
    const {Id_falla,Id_componente} = req.params;
    // const Id_componente = req.body.Id_componente;
    try {
        const fallaResult = await validExist("falla",Id_falla,"Id_falla","NOTEXIST");
        const componenteResult = await validExist("componente",Id_componente,"Id_componente","NOTEXIST");
        fallaResult != null && errors.push(fallaResult);
        componenteResult != null && errors.push(componenteResult);
        
        if (errors.length>0) { return res.status(422).json({errors}); }

        const fallaComponenteResult = await fallaComponente.findAll({
            where:{
                Id_componente,Id_falla
            }
        })
        // console.log(fallaComponenteResult[0]);
        if (!fallaComponenteResult[0]) {
            return res.status(422).json({error:"No existe ese registro en falla_componente"});
        }    

        await falla.destroy({ where:{ Id_falla } });
        await fallaComponente.destroy({ where:{ Id_componente,Id_falla } });
        
        return res.json({
            message:'User DELETE Successfully',
            data:{Id_componente,Id_componente}
        })

    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       }) 
    }
}

module.exports = {
    creatingfFallaC,
    updatefFallaC,
    deletefFallaC
};