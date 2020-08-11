module.exports = (sequelize,type) =>{
    return sequelize.define("Categoria",{
        Id_categoria:{
            type:type.INTEGER,
            autoIncrement: true,
            primaryKey:true
        },
        Nombre_categoria:{
            type:type.STRING,
        },
    },{
        freezeTableName: true
    })
}