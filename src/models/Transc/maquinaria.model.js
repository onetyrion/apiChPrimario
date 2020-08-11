module.exports = (sequelize,type) =>{
    return sequelize.define("Maquinaria",{
        Id_maquinaria:{
            type:type.INTEGER,
            primaryKey:true,
            references: {
                model: 'Componentes',
                key: 'Id_maquinaria'
            }
        },
        Nombre_maquinaria:{
            type:type.TEXT
        },
        Estado:{
            type:type.BOOLEAN
        },
        Id_area:{
            type:type.INTEGER
        },
    },{
        freezeTableName: true
    })
}