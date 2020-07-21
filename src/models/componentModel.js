module.exports = (sequelize,type) =>{
    return sequelize.define("[Componente]",{
        Id_componente:{
            type:type.INTEGER,
            autoIncrement: true,
            primaryKey:true
        },
        Denominacion:{
            type:type.STRING,
        },
        Id_maquinaria:{
            type:type.INTEGER,
            references: {
                model: 'Maquinaria',
                key: 'Id_maquinaria'
            }
        },
        Estado:{
            type:type.BOOLEAN,
        },
    },{
        freezeTableName: true
    })
}