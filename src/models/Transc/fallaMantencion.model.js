module.exports = (sequelize,type) =>{
    return sequelize.define("Falla_Mantencion",{
        Id_FallaMantencion:{
            type:type.INTEGER,
            autoIncrement: true,
            primaryKey:true
        },
        Id_mantencion:{
            type:type.INTEGER,
            references: {
                model: 'Mantencion',
                key: 'Id_mantencion'
            }
        },
        Id_falla:{
            type:type.INTEGER,
            references: {
                model: 'Falla',
                key: 'Id_falla'
            }
        }
    },{
        freezeTableName: true
    })
}