module.exports = (sequelize,type) =>{
    return sequelize.define("ReporteKPI",{
        Id_reportekpi:{
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
                model: 'KPI',
                key: 'Id_kpi'
            }
        },
        Fecha:{
            type:type.DATE
        },
        Resultado_kpi:{
            type:type.FLOAT
        },
        Mes:{
            type:type.STRING
        },
    },{
        freezeTableName: true
    })
}