//dependences
const vauthRoute = require("express").Router();

//Routes
vauthRoute.get('/', async (req, res) => {
    // console.log(req.user)
    res.json({
        "success":"token valido",
        "token":req.headers["user-token"],
        "user":{
            "userId":req.user.userId,
            "rol":req.user.rol
        }
    })
}); 

module.exports = vauthRoute;