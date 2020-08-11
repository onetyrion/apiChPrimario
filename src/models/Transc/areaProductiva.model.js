module.exports = (sequelize,type) =>{
    return sequelize.define("Area_Productiva",{
        Id_area:{
            type:type.INTEGER,
            autoIncrement: true,
            primaryKey:true,
            references: {
                model: 'Usuario_AreaProductiva',
                key: 'Id_area'
            },
            references: {
                model: 'Maquinaria',
                key: 'Id_area'
            }
        },
        Nombre_area:{
            type:type.STRING,
        },
    },{
        freezeTableName: true
    })
}