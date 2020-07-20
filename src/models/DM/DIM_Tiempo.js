module.exports = (sequelize,type) =>{
    return sequelize.define("[DIM_Tiempo]",{
        Id_tiempo:{
            type:type.INTEGER,
            primaryKey:true,
            references: {
                model: 'FACT_Mantencion',
                key: 'Id_tiempo'
            }
        },
        Año:{
            type:type.INTEGER
        },
        NombreMes:{
            type:type.STRING
        },
        Mes:{
            type:type.INTEGER
        },
        Fecha:{
            type:type.DATEONLY
        },
        dia:{
            type:type.INTEGER
        }
    },{
        freezeTableName: true
    })
}