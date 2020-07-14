const jwtsimple = require('jwt-simple');
const { tokenWord } = require('../../config/token');
const moment = require('moment');

const checkToken = (req, res, next) => {
    if (!req.headers['user-token']) {
        return res.json({ error: "No incluye token"});
    }

    const userToken = req.headers['user-token'];
    let payload = {};
    try {
        payload = jwtsimple.decode(userToken,tokenWord);
    } catch (error) {
        return res.json({ error: "El token es invalido"});
    }

    if(payload.expiredAt < moment.unix()){
        return res.json({ error: "El token ha expirado"});
    }

    req.userId=payload.userid;
    next()
}

module.exports = {
    checkToken
}