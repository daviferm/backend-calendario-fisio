var express = require('express');

var Cita = require('../models/citaSchema');

var _ = require('underscore');

var { verificaToken } = require('../middelwares/autentication');

var app = express();



//=================================================
// Petición de todas las citas
//=================================================
app.get('/', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Cita.find({})
        .populate('medicoId', 'nombre')
        .populate('pacienteId', 'nombre apellidos')
        .skip(desde)
        .limit(limite)
        .exec((err, cita) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error cargando Cirtas',
                    errors: err
                });
            }

            Cita.countDocuments((err, conteo) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error al contar Ciats',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    cita,
                    total: conteo
                })
            })

        })
});

//=================================================
// Petición cita por dia
//=================================================
app.get('/:dia', function(req, res) {

    let dia = req.params.dia;

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Cita.find({ 'dia': dia })
        .populate('medicoId', 'nombre')
        .populate('pacienteId', 'nombre apellidos')
        .skip(desde)
        .limit(limite)
        .exec((err, cita) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error cargando Citas',
                    errors: err
                });
            }

            Cita.countDocuments((err, conteo) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error al contar Citas',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    cita,
                    total: conteo
                })
            })

        })
});

//=================================================
// Actualizar un hospital
//=================================================
app.put('/:id', verificaToken, function(req, res) {

    var id = req.params.id;

    var body = req.body;

    Cita.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                menssage: 'Error al buscar la cita médica',
                err
            });
        }
        if (hospital.value === null) {
            return res.status(400).json({
                ok: false,
                menssage: 'La cita con el ' + id + ' no existe.',
                errors: { menssage: 'No existe una cita con ese id' }
            });
        }

        // let body = _.pick(req.body, ['nombre', 'img', 'usuario']);

        Cita.findByIdAndUpdate(id, body, { new: true }, (err, citaDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    menssage: 'Error al actualizar la cita',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                cita: citaDB
            });

        })
    })

});

//=================================================
// Creación de un registro de hospital
//=================================================
app.post('/', verificaToken, function(req, res) {

    var body = req.body;

    var cita = new Cita({
        medicoId: body.medicoId,
        pacienteId: body.pacienteId,
        dia: body.dia,
        inicio: body.inicio,
        minutos: body.minutos,
        duracion: body.duracion,
        color: body.color
    });

    cita.save((err, citaGuardada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error guardar el Hospital',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            citaGuardada,
            creado: req.usuario
        })
    })
});

app.delete('/:id', verificaToken, function(req, res) {

    var id = req.params.id;

    Cita.findByIdAndRemove(id, { rawResult: true }, (err, citaBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al eliminar el hospital',
                errors: err
            });
        }

        if (citaBorrada.value === null) {
            return res.status(400).json({
                ok: false,
                menssage: 'La cita con el ' + id + ' no existe.',
                errors: { menssage: 'No existe una cita con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            cita: citaBorrada

        })
    })
})



module.exports = app;