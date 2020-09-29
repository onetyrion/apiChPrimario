//dependences
const vauthRoute = require("express").Router();

//Routes
vauthRoute.get('/', async (req, res) => {
    console.log("token valido")
    res.json({"success":"token valido","token":req.headers["user-token"]})
}); 

module.exports = vauthRoute;