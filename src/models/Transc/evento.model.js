module.exports = (sequelize,type) =>{
    return sequelize.define("Evento",{
        Id_evento:{
            type:type.INTEGER,
            autoIncrement: true,
            primaryKey:true,
            references: {
                model: 'Mantencion',
                key: 'Id_evento'
            }
        },
        Nombre_evento:{
            type:type.STRING,
        }
    },{
        freezeTableName: true
    })
}