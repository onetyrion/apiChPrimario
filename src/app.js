//Dependences
const express = require("express");
const morgan = require("morgan");
const { json } = require("body-parser");

//Imports
import usersRouter from "./routes/usersRoute";
import loginRouter from "./routes/loginRoute";
import router from "./routes/api";

//Initialization
const app = express();

require('./database/database')

//middlewares
app.use(morgan("dev"));
app.use(json());

//Routers
app.use('/api',router);


export default app;