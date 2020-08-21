module.exports = (sequelize,type) =>{
    return sequelize.define("Area_Productiva",{
        Id_area:{
            type:type.INTEGER,
            autoIncrement: true,
            primaryKey:true
        },
        Nombre_area:{
            type:type.STRING,
        },
    },{
        freezeTableName: true
    })
}