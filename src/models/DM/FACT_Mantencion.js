module.exports = (sequelize,type) =>{
    return sequelize.define("[FACT_Mantencion]",{
        Id_falla:{
            type:type.INTEGER
        },
        Id_tiempo:{
            type:type.INTEGER,
            references: {
                model: 'DIM_Tiempo',
                key: 'Id_tiempo'
            }
        },
        Id_evento:{
            type:type.INTEGER
        },
        Id_tipo:{
            type:type.INTEGER
        },
        Id_componente:{
            type:type.INTEGER
        },
        Hrs_programadas:{
            type:type.FLOAT
        },
        Hrs_noProgramadas:{
            type:type.FLOAT
        },
        Disponibilidad:{
            type:type.FLOAT
        },
        MTTR:{
            type:type.FLOAT
        },
        MTBF:{
            type:type.FLOAT
        },
        MTBME:{
            type:type.FLOAT
        },
        CantEventos_programados:{
            type:type.INTEGER
        },
        CantEventos_noProgramados:{
            type:type.FLOAT
        },
        HrsTotales_mantencion:{
            type:type.FLOAT
        },
    },{
        freezeTableName: true
    })
}