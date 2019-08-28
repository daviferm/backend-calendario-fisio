var express = require('express');
const bcrypt = require('bcrypt');

var Medico = require('../models/medicoSchema');


var _ = require('underscore');

var { verificaToken } = require('../middelwares/autentication');

var app = express();


app.get('/', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Medico.find({})
        .skip(desde)
        .limit(limite)
        .exec((err, medicos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al obtener los médicos.',
                    errors: err
                });
            }

            Medico.countDocuments((err, conteo) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error al contar los médicos',
                        errors: err
                    })
                }

                res.status(200).json({
                    ok: true,
                    medicos: medicos,
                    total: conteo
                })

            })


        })
})


app.post('/', verificaToken, function(req, res) {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        password: bcrypt.hashSync(body.password, 10),
        email: body.email,
        img: body.img,
        direccion: body.direccion,
        telefono: body.telefono
    });
    medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error guardar el médico.',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            medico: medicoGuardado
        })
    })
});

app.put('/:id', verificaToken, function(req, res) {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al editar el médico.',
                errors: err
            })
        }

        if (medico.value === null) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe un médico con el id: ' + id,
                errros: { message: 'No existe un médico con este id.' }
            })
        }

        medico.nombre = body.nombre;
        medico.email = body.email;
        medico.img = body.img;
        medico.direccion = body.direccion;
        medico.telefono = body.telefono;

        medico.save((err, medicoActualizado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al actualizar el médico.',
                    errors: err
                });
            }

            res.status(201).json({
                ok: true,
                medico: medicoActualizado
            })
        })
    })

});

app.delete('/:id', verificaToken, function(req, res) {

    var id = req.params.id;

    Medico.findByIdAndDelete(id, { rawResult: true }, (err, medicoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al eliminar el médico.',
                errors: err
            })
        }

        if (medicoBorrado.value === null) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe un médico con el id: ' + id,
                errros: { message: 'No existe un médico con este id.' }
            })
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        })

    })
})




module.exports = app;