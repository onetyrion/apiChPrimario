const {
	Sequelize
} = require('sequelize');
const usersModel = require('../models/usersModel');
const loginModel = require('../models/loginModel');
const rolModel = require('../models/rolModel');
const componenteModel = require('../models/componentModel');

const sequelize = new Sequelize('Mantencion', "onetyrion", 'Test!01', {
	dialect: 'mssql',
	host: 'DESKTOP-8RCV95Q',
    port: '1433',
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
	componente
}