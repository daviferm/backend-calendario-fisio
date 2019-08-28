const jwt = require('jsonwebtoken');

let SEED = require('../config/config').SEED;



let verificaToken = (req, res, next) => {

    // Recibe el token par url
    let token = req.query.token;

    // decoded tiene los datos del usuario logueado
    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                menssage: 'El token no es válido',
                errors: err
            });
        }
        // return res.json({
        //     ok: true,
        //     decoded: decoded
        // })

        // Guardamos en el request el usuarios que nos devuelve el token
        req.usuario = decoded.usuario;

        next();
    })
}

module.exports = {
    verificaToken
}