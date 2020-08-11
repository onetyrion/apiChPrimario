module.exports = (sequelize,type) =>{
    return sequelize.define("Programa_Mantencion",{
        Id_ProgramaMantencion:{
            type:type.INTEGER,
            primaryKey:true
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
                model: 'KPI',
                key: 'Id_kpi'
            }
        },
        Año:{
            type:type.INTEGER
        },
        Meta:{
            type:type.FLOAT
        }
    },{
        freezeTableName: true
    })
}