//Dependences
const express = require("express");
const morgan = require("morgan");
const { json } = require("body-parser");
const cors = require('cors');

//Imports
import usersRouter from "./routes/usersRoute";
import loginRouter from "./routes/loginRoute";
import router from "./routes/api";

//Initialization
const app = express();
app.use(cors());

require('./database/database');
require('./database/databaseDM');

//Whitelist de las conexiones que se comunican con la API
var whitelist = ['http://localhost:3100']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(origin)
      callback(new Error('Not allowed by CORS, contacte con el administrador del sistema diego.m.tapia.z@gmail.com'));
    }
  }
}

app.get('/', cors(corsOptions), (req, res) =>{    
    res.json({mensaje: 'ok'});
});
//middlewares
app.use(morgan("dev"));
app.use(json());

//Routers
app.use('/api',router);


export default app;