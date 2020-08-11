module.exports = (sequelize,type) =>{
    return sequelize.define("Tipo_mantencion",{
        Id_tipo:{
            type:type.INTEGER,
            primaryKey:true
        },
        Nombre:{
            type:type.STRING
        }
    },{
        freezeTableName: true
    })
}