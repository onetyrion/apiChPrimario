
const { creatingMantencion } = require('./mantencion.controller');
const { creatingfallaMantencion } = require ('./fallaMatencion.controller');
const { validExist } = require('../Helpers');

//POST Create 
const creatingfMantencion = async(req,res)=>{
    const errors = []
    const { Id_falla,Id_componente,Id_tipo,Id_evento } = req.body;
    try {
        const componentResult = await validExist("componente",Id_componente,"Id_componente","NOTEXIST");
        const tipoMantencionResult = await validExist("tipoMantencion",Id_tipo,"Id_tipo","NOTEXIST");
        const eventoResult = await validExist("evento",Id_evento,"Id_evento","NOTEXIST");
        const fallaResult = await validExist("falla",Id_falla,"Id_falla","NOTEXIST");

        fallaResult != null && errors.push(fallaResult);
        componentResult != null && errors.push(componentResult);
        tipoMantencionResult != null && errors.push(tipoMantencionResult);
        eventoResult != null && errors.push(eventoResult);

        const newMantencion = await creatingMantencion(req,res);
        
        //VALIDATION ID_MANTENCION
        const mantencionResult = await validExist("mantencion",Id_mantencion,"id_mantencion","NOTEXIST"); 
        mantencionResult != null && errors.push(mantencionResult); 
        if (errors.length>0) { return res.status(422).json({errors}); }

        const newfallamantencion = await creatingfallaMantencion({Id_mantencion:newMantencion.Id_mantencion,Id_falla:Id_falla},res);

        if (newMantencion) {
            res.json({
                message:'Mantencion Created Successfully',
                data:{newMantencion,newfallamantencion}
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

module.exports = {
    creatingfMantencion
};