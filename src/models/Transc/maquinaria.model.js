module.exports = (sequelize,type) =>{
    return sequelize.define("Maquinaria",{
        Id_maquinaria:{
            type:type.INTEGER,
            primaryKey:true,
            autoIncrement: true
        },
        Nombre_maquinaria:{
            type:type.STRING
        },
        Estado:{
            type:type.BOOLEAN
        },
        Empresa:{
            type:type.STRING
        },
        Id_area:{
            type:type.INTEGER,
            references: {
                model: 'Area_Productiva',
                key: 'Id_area'
            }
        },
        Id_tipo:{
            type:type.INTEGER,
            references: {
                model: 'Tipo_Maquinaria',
                key: 'Id_tipo'
            }
        },
    },{
        freezeTableName: true,
        timestamps: false
    })
}