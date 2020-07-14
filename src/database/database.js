const { Sequelize } = require('sequelize');
const usersModel = require('../models/usersModel');
const loginModel = require('../models/loginModel');
const rolModel = require('../models/rolModel');

const sequelize = new Sequelize('Mantencion', "sqlserver", 'GbB8Cf79KGcHpoeI', {
    dialect: 'mssql',
    host: 'localhost',
    timestamps: false,  
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
  });

  const users = usersModel(sequelize,Sequelize);
  const login = loginModel(sequelize,Sequelize);
  const rol = rolModel(sequelize,Sequelize);

  sequelize.sync({ force: false})
  .then(()=>{
    console.log("tablas sincronizadas")
  })

  module.exports = {
    users,
    login,
    rol
  }