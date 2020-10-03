module.exports = (sequelize,type) =>{
    return sequelize.define("Empresa",{
        Id_empresa:{
            type:type.INTEGER,
            autoIncrement: true,
            primaryKey:true
        },
        Nombre_empresa:{
            type:type.STRING
        },
        Logo:{
            type:type.BLOB
        },
        Estado:{
            type:type.BOOLEAN
        },
    },{
        freezeTableName: true,
        timestamps: false
    })
}