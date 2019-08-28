const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SEED = require('../config/config').SEED;


const app = express();
const Medico = require('../models/medicoSchema');


app.post('/', (req, res) => {

    const body = req.body;

    Medico.findOne({ nombre: body.nombre }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuarios',
                errors: err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                message: 'Creedenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Creedenciales incorrectas - password',
                errors: err
            });

        }

        // Crear un token
        usuarioDB.password = ':)';
        const token = jwt.sign({
            usuario: usuarioDB
        }, SEED, { expiresIn: '24h' });


        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        })
    })

})


module.exports = app;