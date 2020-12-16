//Dependences
import "@babel/polyfill";
const express = require("express");
const morgan = require("morgan");
const { json } = require("body-parser");
const cors = require('cors');

//Imports
import router from "./routes/api";

//Initialization
const app = express();
app.use(cors());


//Auth Database trans and Datamart
require('./database/database');
require('./database/databaseDM');

//CORS--------
var whitelist = ['http://localhost:3000/','http://localhost:3100/']
var corsOptions = {
  origin: function (origin, callback) {
    // if (true) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(origin)
      callback(new Error('Not allowed by CORS, contact to admin system diego.m.tapia.z@gmail.com'));
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