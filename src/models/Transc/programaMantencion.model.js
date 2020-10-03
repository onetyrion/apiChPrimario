module.exports = (sequelize,type) =>{
    return sequelize.define("Programa_Mantencion",{
        Id_ProgramaMantencion:{
            type:type.INTEGER,
            primaryKey:true,
            autoIncrement: true
        },
        Id_maquinaria:{
            type:type.INTEGER,
            references: {
                model: 'Maquinaria',
                key: 'Id_maquinaria'
            }
        },
        Id_kpi:{
            type:type.INTEGER,
            references: {
                model: 'Indicador',
                key: 'Id_kpi'
            }
        },
        Year:{
            type:type.INTEGER
        },
        Meta:{
            type:type.FLOAT
        }
    },{
        freezeTableName: true,
        timestamps: false
    })
}