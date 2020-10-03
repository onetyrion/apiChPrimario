module.exports = (sequelize,type) =>{
    return sequelize.define("Rol",{
        Id_rol:{
            type:type.INTEGER,
            primaryKey:true,
            autoIncrement: true
        },
        Nombre_rol:{
            type:type.STRING,
        }
    },{
        freezeTableName: true,
        timestamps: false
    })
}