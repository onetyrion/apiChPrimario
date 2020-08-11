
const { users, login, componente } = require("../database/database");

//POST Create Component
const CreatingComponent = async(req,res)=>{
    const { Denominacion,Id_maquinaria,Estado } = req.body;
    try {

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
    //console.log(req)
    try {
        //VALID EXIST ON TABLE componente
        const Idcomponente = await componente.findAll({
            attributes: ['Id_componente'],
            where:{
                Id_componente:req.params.id_componente
            }
        });
        if (typeof Idcomponente[0] == 'undefined') {
            return res.status(422).json({errores : "El componente ingresado no esta registrado"})
        }
        await componente.update(req.body,{
            where:{ Id_componente: req.params.id_componente}
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
    if (Number.isInteger(req.params.id_componente)) {
        return res.status(422).json({errores : "El id del componente no es valido"})
    }
    try {
        //VALID EXIST ON TABLE componente
        const Idcomponente = await componente.findAll({
            attributes: ['Id_componente'],
            where:{
                Id_componente:req.params.id_componente
            }
        });
        if (typeof Idcomponente[0] == 'undefined') {
            return res.status(422).json({errores : "El componente ingresado no esta registrado"})
        }
        
        await componente.destroy({
            where:{ Id_componente: req.params.id_componente}
        });
        console.log(`Componente Eliminado ${req.params.id_componente}`);
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