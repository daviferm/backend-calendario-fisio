const express = require('express');

var { verificaToken } = require('../middelwares/autentication');

const _ = require('underscore');

const Usuario = require('../models/usuarioSchema');

const app = express();


//=================================================
// Optener usuarios
//=================================================
app.get('/', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find()
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error cargando usuarios',
                    errors: err
                });
            }

            Usuario.countDocuments((err, conteo) => {

                res.status(200).json({
                    ok: true,
                    usuarios,
                    total: conteo

                })

            });
        })
});
app.get('/total', (req, res) => {

    Usuario.find()
        .exec((err, usuarios) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error cargando todos los usuarios',
                    errors: err
                });
            }

            Usuario.countDocuments((err, conteo) => {

                res.status(200).json({
                    ok: true,
                    usuarios,
                    total: conteo

                })

            });
        })

})

//=================================================
// Buscar usuario por su id
//=================================================
app.get('/:id', verificaToken, function(req, res) {

    let id = req.params.id;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                menssage: 'Error al buscar usuario',
                err
            });
        }
        if (usuario.value === null) {
            return res.status(400).json({
                ok: false,
                menssage: 'El usuario con el ' + id + ' no existe.',
                errors: { menssage: 'No existe un usuario con ese id' }
            });
        }

        return res.status(200).json({
            ok: true,
            usuario
        })

    })

})

//=================================================
// Actualizar usuarios
//=================================================
app.put('/:id', verificaToken, function(req, res) {

    let id = req.params.id;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                menssage: 'Error al buscar usuario',
                err
            });
        }
        if (usuario.value === null) {
            return res.status(400).json({
                ok: false,
                menssage: 'El usuario con el ' + id + ' no existe.',
                errors: { menssage: 'No existe un usuario con ese id' }
            });
        }

        let body = _.pick(req.body, ['nombre', 'apellidos', 'email', 'img', 'direccion', 'ciudad', 'provincia', 'codigoPostal', 'nacimiento', 'angiguedad', 'observaciones', 'telefono']);

        Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    menssage: 'Error al actualizar usuario',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                usuario: usuarioDB
            });

        })
    })

});

//=================================================
// Crear un usuarios
//=================================================
app.post('/', verificaToken, function(req, res) {

    const body = req.body;

    const usuario = new Usuario({
        nombre: body.nombre,
        apellidos: body.apellidos,
        email: body.email,
        telefono: body.telefono,
        genero: body.genero,
        nacimiento: body.nacimiento,
        img: body.img,
        direccion: body.direccion,
        codigoPostal: body.codigoPostal,
        ciudad: body.ciudad,
        provincia: body.provincia,
        antiguedad: body.antiguedad,
        observaciones: body.observaciones,
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al crear usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuarioGuardado,
            usuarioToken: req.usuario
        })
    })
});


//=================================================
// Eliminar usuarios por el id
//=================================================
app.delete('/:id', verificaToken, function(req, res) {
    const id = req.params.id;

    Usuario.findByIdAndRemove(id, { rawResult: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al borrar usuario',
                errors: err
            });
        }
        if (usuarioDB.value === null) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id.',
                message: { message: 'No existe un usuario con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioDB
        });
    })
})


module.exports = app;