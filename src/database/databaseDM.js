const {	Sequelize} = require('sequelize');
const config = require('../../config/config');

//models
const FACT_MantencionModel = require('../models/DM/FACT_Mantencion');
const DIM_TiempoModel = require('../models/DM/DIM_Tiempo');

const sequelize = new Sequelize(config.dbnamedm, config.username, config.password, {
	dialect: 'mssql',
	host: config.host,
    port: config.port,
	timestamps: false,
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
})
///////////////TEST CONNECTION 

// .authenticate()
// .then(function(err) {
//   console.log('Connection has been established successfully.');
// })
// .catch(function (err) {
//   console.log('Unable to connect to the database:', err);
// });

const FACT_Mantencion = FACT_MantencionModel(sequelize, Sequelize);
const DIM_Tiempo = DIM_TiempoModel(sequelize, Sequelize);

FACT_Mantencion.hasOne(DIM_Tiempo,{ foreignKey:"Id_tiempo" });
DIM_Tiempo.hasOne(FACT_Mantencion,{ foreignKey:"Id_tiempo" });

sequelize.sync({
		force: false
	})
	.then(() => {
		console.log("\n**************************************\n tablas sincronizadas en DATAMART \n**************************************\n")
	})

module.exports = {
	FACT_Mantencion,
	DIM_Tiempo,
	sequelize
}