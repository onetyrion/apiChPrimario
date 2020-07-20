const loginRoute = require("express").Router();
const bcrypt = require('bcryptjs');
const {
    check,
    validationResult
} = require('express-validator');

//Controllers
const {
    CreatingUser,
    ListUsers,
    UpdateUser,
    DeleteUser
} = require("../controllers/login.controller")
const {
    users,
    login
} = require("../database/database");
const moment = require('moment');
const jwtsimple = require('jwt-simple');
const {
    tokenWord
} = require("../../config/token");

//************************ */
//ROUTES 

loginRoute.post('/create', [
    check('Rut', 'El Rut es Obligatorio').not().isEmpty(),
    check('Contraseña', 'La contraseña es Obligatoria').not().isEmpty(),
    check('Id_rol', 'El rol tiene que ser valido').isInt()
], async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errores: errors.array()
        })
    }
    CreatingUser(req, res);
});

loginRoute.post('/', async (req, res) => {
    console.log(req.body);
    const userLogin = await login.findOne({
        where: {
            Rut: req.body.Rut
        }
    });
    if (userLogin) {
        const igualar = bcrypt.compareSync(req.body.Contraseña, userLogin.Contraseña);
        if (igualar) {
            console.log(tokenWord);
            res.json({
                success: createToken(userLogin),
                user:userLogin
            });
        } else {
            res.send({
                error: "Error en usuario y/o contraseña"
            });
        }
    } else {
        res.send({
            error: "Error en usuario y/o contraseña"
        });
    }
});

loginRoute.get('/', ListUsers)

loginRoute.put('/:userRUT', UpdateUser)

loginRoute.delete('/:userRUT', DeleteUser)

const createToken = (user) => {
    const payload = {
        userid: user.Rut,
        createdAt: moment().unix(),
        expiredAt: moment().add(60, 'minutes').unix()
    }
    return jwtsimple.encode(payload, tokenWord) //TOKEN WORD IS A STRING KEY TO ENCRIPT TOKEN
}

module.exports = loginRoute;