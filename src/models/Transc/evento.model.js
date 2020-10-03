module.exports = (sequelize,type) =>{
    return sequelize.define("Evento",{
        Id_evento:{
            type:type.INTEGER,
            autoIncrement: true,
            primaryKey:true
        },
        Nombre_evento:{
            type:type.STRING,
        }
    },{
        freezeTableName: true,
        timestamps: false
    })
}