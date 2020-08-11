module.exports = (sequelize,type) =>{
    return sequelize.define("Tipo_falla",{
        Id_Tipo:{
            type:type.INTEGER,
            autoIncrement: true,
            primaryKey:true
        },
        Nombre:{
            type:type.STRING
        }
    },{
        freezeTableName: true
    })
}