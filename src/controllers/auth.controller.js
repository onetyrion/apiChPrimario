//dependences
const bcrypt = require('bcryptjs');
const jwtsimple = require('jwt-simple');
const moment = require('moment');

//imports
const { users, login } = require("../database/database");
const { tokenWord } = require("../../config/token");

//----------------------------Routers-------------------------------
//POST Create User
const LoginAuth = async(req,res)=>{
    const userLogin = await login.findOne({ where: { Rut: req.body.Rut } });
    const user = await users.findOne({ where: { Rut: req.body.Rut } });
    console.log(user.Estado)
    if (!user.Estado) {
        res.status(422).json({
            error: "Cuenta Desactivada"
        });
    }
    if (userLogin) {
        const igualar = bcrypt.compareSync(req.body.Password, userLogin.Password);
        if (igualar) {
            res.json({
                success: createToken(userLogin),
                user:{Rut:userLogin.Rut,Rol:userLogin.Id_rol}
            });
        } else {
            res.status(422).json({
                error: "Error en usuario y/o contraseña"
            });
        }
    } else {
        res.send({
            error: "Error en usuario y/o contraseña1"
        });
    }
}

const createToken = (user) => {
    const payload = {
        userid: user.Rut,
        rol: user.Id_rol,
        createdAt: moment().unix(),
        expiredAt: moment().add(60, 'minutes').unix()
    }
    return jwtsimple.encode(payload, tokenWord) //TOKENWORD IS A STRING KEY TO ENCRIPT TOKEN
}

module.exports = {LoginAuth};