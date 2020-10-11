
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
        // const mantencionResult = await validExist("mantencion",Id_mantencion,"id_mantencion","NOTEXIST"); 

        // mantencionResult != null && errors.push(mantencionResult); 
        fallaResult != null && errors.push(fallaResult);
        componentResult != null && errors.push(componentResult);
        tipoMantencionResult != null && errors.push(tipoMantencionResult);
        eventoResult != null && errors.push(eventoResult);

        if (errors.length>0) {
            return res.status(422).json({errors});
        }

        const newMantencion = await creatingMantencion(req,res);
        const newfallamantencion = await creatingfallaMantencion({Id_mantencion:newMantencion.Id_mantencion,Id_falla:Id_falla},res);

        if (newMantencion) {
            console.log(newfallamantencion);
            res.json({
                message:'Mantencion Created Successfully',
                data:{newMantencion,newfallamantencion}
            })
        }
        // .then(values=>)
        // .then(async(newMantencion)=>{

        //     const newfallamantencion = await creatingfallaMantencion({Id_mantencion:newMantencion.dataValues.Id_mantencion,Id_falla:Id_falla},res);
        //     if (newfallamantencion) {
        //         // console.log(newfallamantencion);
        //         res.json({
        //             message:'Mantencion Created Successfully',
        //             data:{newMantencion,newfallamantencion}
        //         })
        //     }
        // })

    } catch (error) {
        console.log(error);
        return res.status(500),json({
           message:"Ha ocurrido un error",
           data:{}
       }) 
    }
}

//Get List 
// const ListMantencion = async(req,res)=>{
//     try {
//         const MantencionList = await mantencion.findAll();
//         res.json(MantencionList);
//     } catch (error) {
//         console.log(error);
//         return res.status(500),json({
//            message:"Ha ocurrido un error",
//            data:{}
//        })         
//     }
// }
// //PUT UPDATE 
// const UpdateMantencion = async(req,res)=>{
//     const { Id_componente,Id_evento,Id_tipo } = req.body;
//     const id_mantencion = req.params.Id_mantencion;

//     try {  
//         const errors = []
//         const mantencionResult = await validExist("mantencion",id_mantencion,"id_mantencion","NOTEXIST");
//         const componentResult = await validExist("componente",Id_componente,"Id_componente","NOTEXIST");
//         const tipoMantencionResult = await validExist("tipoMantencion",Id_tipo,"Id_tipo","NOTEXIST");
//         const eventoResult = await validExist("evento",Id_evento,"Id_evento","NOTEXIST");

//         mantencionResult != null && errors.push(mantencionResult);
//         componentResult != null && errors.push(componentResult);
//         tipoMantencionResult != null && errors.push(tipoMantencionResult);
//         eventoResult != null && errors.push(eventoResult);

//         if (errors.length>0) {
//             return res.status(422).json({errors});
//         }

//         await mantencion.update(req.body,{
//             where:{ Id_mantencion: id_mantencion}
//         });
//         console.log("Mantencion Modificada");
//         res.json({success:'Se ha modificado'});
//     } catch (error) {
//         console.log(error);
//         return res.status(500),json({
//            message:"Ha ocurrido un error",
//            data:{}
//        })          
//     }
// }
// //DELETE
// const DeleteMantencion = async(req,res)=>{
//     if (Number.isInteger(req.params.Id_mantencion)) {
//         return res.status(422).json({errores : "El id del mantencion no es valido"})
//     }
//     const id_mantencion = req.params.Id_mantencion;
//     try {
//         const errors = []
//         const mantencionResult = await validExist("mantencion",id_mantencion,"id_mantencion","NOTEXIST"); 

//         mantencionResult != null && errors.push(mantencionResult); 

//         if (errors.length>0) {
//             return res.status(422).json({errors});
//         }
//         //VALID ID_FALLAMANTENCION
//         const IdfallaMantencion = await fallaMantencion.findAll({
//             attributes: ['Id_FallaMantencion'],
//             where:{
//                 Id_mantencion:id_mantencion
//             }
//         });
//         if (typeof IdfallaMantencion[0] != 'undefined') {
//             return res.status(422).json({errores : "El id ingresado ya esta registrado, primero elimine la falla asociada a la mantecion"})
//         }

//         await mantencion.destroy({
//             where:{ Id_mantencion: id_mantencion}
//         });
//         console.log(`Mantencion Eliminada ${id_mantencion}`);
//         res.json({success:'Se ha Eliminado'});
//     } catch (error) {
//         console.log(error);
//         return res.status(500),json({
//            message:"Ha ocurrido un error",
//            data:{}
//        })         
//     }
// }
module.exports = {
    // UpdateMantencion,
    // DeleteMantencion,
    // ListMantencion,
    creatingfMantencion
};