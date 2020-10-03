module.exports = (sequelize,type) =>{
    return sequelize.define("Usuario",{
        Rut:{
            type:type.STRING,
            primaryKey:true
        },
        Nombre:{
            type:type.STRING,
        },
        Apellidos:{
            type:type.STRING,
        },
        Correo_electronico:{
            type:type.STRING,
        },
        Estado:{
            type:type.BOOLEAN,
        },
        Cargo:{
            type:type.STRING,
        },
        Id_empresa:{
            type:type.INTEGER,
            references: {
                model: 'Empresa',
                key: 'Id_empresa'
            }
        },
    },{
        freezeTableName: true,
        timestamps: false
    })
}