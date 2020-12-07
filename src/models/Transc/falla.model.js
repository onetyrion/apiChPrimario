module.exports = (sequelize,type) =>{
    return sequelize.define("Falla",{
        Id_falla:{
            type:type.INTEGER,
            autoIncrement: true,
            primaryKey:true
        },
        Id_categoria:{
            type:type.INTEGER,
            references: {
                model: 'Categoria',
                key: 'Id_categoria'
            }
        },
        Descripcion_causa:{
            type:type.STRING
        },
        // Id_tipo:{
        //     type:type.INTEGER,
        //     references: {
        //         model: 'Tipo_falla',
        //         key: 'Id_tipo'
        //     }
        // },
        Falla:{
            type:type.BOOLEAN
        },
    },{
        freezeTableName: true,
        timestamps: false
    })
}