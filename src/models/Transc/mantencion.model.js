module.exports = (sequelize,type) =>{
    return sequelize.define("Mantencion",{
        Id_componente:{
            type:type.INTEGER,
            references: {
                model: 'Componente',
                key: 'Id_componente'
            }
        },
        Id_mantencion:{
            type:type.INTEGER,
            primaryKey:true,
            autoIncrement: true,
        },
        Id_evento:{
            type:type.INTEGER,
            references: {
                model: 'Evento',
                key: 'Id_evento'
            }
        },
        Id_tipo:{
            type:type.INTEGER,
            references: {
                model: 'Tipo_Mantencion',
                key: 'Id_tipo'
            }
        },
        Fecha_mantencion:{
            type:type.DATEONLY
        },
        CantEvento_especial:{
            type:type.INTEGER
        },
        Duracion:{
            type:type.FLOAT
        },
        Descripcion:{
            type:type.STRING
        },
        Horas_programadas:{
            type:type.FLOAT
        },
        Horas_no_programadas:{
            type:type.FLOAT
        },
        Cantidad_evProgramados:{
            type:type.INTEGER
        },
        Cantidad_evNoProgramados:{
            type:type.INTEGER
        },
        RCFA:{
            type:type.INTEGER
        },
        Area:{
            type:type.STRING
        },
        OT:{
            type:type.INTEGER
        },
    },{
        freezeTableName: true,
        timestamps: false
    })
}