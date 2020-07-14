// const { Sequelize, DataTypes } = require('sequelize');
// import { sequelize } from '../database/database';
// import Router from '../routes/usersRoute';

module.exports = (sequelize,type) =>{
    return sequelize.define("[Usuario]",{
        Rut:{
            type:type.STRING,
            primaryKey:true
        },
        Nombre:{
            type:type.STRING,
        },
        Apellidos:{
            type:type.STRING,
        },
        Correo_electronico:{
            type:type.STRING,
        },
        Estado:{
            type:type.BOOLEAN,
        },
        Cargo:{
            type:type.STRING,
        }
    },{
        freezeTableName: true
    })
}
// const userModel = sequelize.define('usuario',{
//     Rut:{
//         type:DataTypes.STRING,
//         primaryKey:true
//     },
//     Nombre:{
//         type:DataTypes.STRING,
//     },
//     Apellidos:{
//         type:DataTypes.STRING,
//     },
//     Correo_electronico:{
//         type:DataTypes.STRING,
//     },
//     Estado:{
//         type:DataTypes.BOOLEAN,
//     },
//     Cargo:{
//         type:DataTypes.STRING,
//     }
// })
// export default userModel;