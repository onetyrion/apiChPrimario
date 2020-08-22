module.exports = (sequelize,type) =>{
    return sequelize.define("Maquinaria",{
        Id_maquinaria:{
            type:type.INTEGER,
            primaryKey:true,
            autoIncrement: true
        },
        Nombre_maquinaria:{
            type:type.TEXT
        },
        Estado:{
            type:type.BOOLEAN
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