module.exports = (sequelize,type) =>{
    return sequelize.define("Falla_Componente",{
        Id_componente:{
            type:type.INTEGER,
            references: {
                model: 'Componente',
                key: 'Id_componente'
            }
        },
        Id_falla:{
            type:type.INTEGER,
            references: {
                model: 'Falla',
                key: 'Id_falla'
            }
        },
        Id_fallaComponente:{
            type:type.INTEGER,
            autoIncrement: true,
            primaryKey:true
        }
    },{
        freezeTableName: true,
        timestamps: false
    })
}