module.exports = (sequelize,type) =>{
    return sequelize.define("KPI",{
        Id_kpi:{
            type:type.INTEGER,
            autoIncrement: true,
            primaryKey:true
        },
        Nombre_kpi:{
            type:type.STRING
        }
    },{
        freezeTableName: true
    })
}