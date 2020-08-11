module.exports = (sequelize,type) =>{
    return sequelize.define("Usuario_AreaProductiva",{
        Id_usuarioArea:{
            type:type.INTEGER,
            primaryKey:true
        },
        Rut:{
            type:type.STRING,
            references: {
                model: 'Usuario',
                key: 'Rut'
            }
        },
        Id_area:{
            type:type.INTEGER,
            references: {
                model: 'Area_Productiva',
                key: 'Id_area'
            }
        },
    },{
        freezeTableName: true
    })
}