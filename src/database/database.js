const {	Sequelize } = require('sequelize');
const config = require('../../config/config');

const usersModel = require('../models/usersModel');
const loginModel = require('../models/loginModel');
const rolModel = require('../models/rolModel');
const componenteModel = require('../models/Transc/componente.model');
const mantencionModel = require('../models/Transc/mantencion.model');
const tipofallaModel = require('../models/Transc/tipo_falla.model');
const categoriaModel = require('../models/Transc/categoria.model');
const fallaModel = require('../models/Transc/falla.model');
const fallaMantencionModel = require('../models/Transc/fallaMantencion.model');
// const maquinariaModel = require('../models/maquinariaModel')

const sequelize = new Sequelize(config.dbnametrans, config.username, config.password, {
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

// .authenticate()
// .then(function(err) {
//   console.log('Connection has been established successfully.');
// })
// .catch(function (err) {
//   console.log('Unable to connect to the database:', err);
// });
const users = usersModel(sequelize, Sequelize);
const login = loginModel(sequelize, Sequelize);
const rol = rolModel(sequelize, Sequelize);
const componente = componenteModel(sequelize, Sequelize);
const mantencion = mantencionModel(sequelize, Sequelize);
const tipoFalla = tipofallaModel(sequelize, Sequelize);
const categoria = categoriaModel(sequelize, Sequelize);
const falla = fallaModel(sequelize, Sequelize);
const fallaMantencion = fallaMantencionModel(sequelize, Sequelize);
// const maquinaria = maquinariaModel(sequelize, Sequelize);

sequelize.sync({
		force: false
	})
	.then(() => {
		console.log("\n**************************************\n tablas sincronizadas en TRANSACCIONAL \n**************************************\n")
	})

module.exports = {
	users,
	login,
	rol,
	componente,
	mantencion,
	tipoFalla,
	categoria,
	falla,
	fallaMantencion,
	// maquinaria,
}