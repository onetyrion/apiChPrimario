module.exports = (sequelize,type) =>{
    return sequelize.define("[Rol]",{
        Id_rol:{
            type:type.INTEGER,
            primaryKey:true,
        },
        Nombre_rol:{
            type:type.STRING,
        }
    },{
        freezeTableName: true
    })
}