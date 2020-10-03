module.exports = (sequelize,type) =>{
    return sequelize.define("Tipo_Maquinaria",{
        Id_Tipo:{
            type:type.INTEGER,
            autoIncrement: true,
            primaryKey:true
        },
        Descripcion:{
            type:type.STRING
        }
    },{
        freezeTableName: true,
        timestamps: false
    })
}