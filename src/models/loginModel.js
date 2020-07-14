module.exports = (sequelize,type) =>{
    return sequelize.define("[Login]",{
        Rut:{
            type:type.STRING,
            primaryKey:true,
            references: {
                model: 'Usuario',
                key: 'Rut'
            }
        },
        Contraseña:{
            type:type.STRING,
        },
        Id_rol:{
            type:type.INTEGER,
            references: {
                model: 'Rol',
                key: 'Id_rol'
            }
        },
    },{
        freezeTableName: true
    })
}