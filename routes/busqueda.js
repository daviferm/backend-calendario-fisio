const express = require('express');

const app = express();


var Cita = require('../models/citaSchema');
var Medico = require('../models/medicoSchema');
var Usuario = require('../models/usuarioSchema');


//=================================================
// Busqueda general en todas las colecciones
//=================================================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;

    var re = new RegExp(busqueda, 'i');

    // Esto nos permite mandar un arreglo de promesas y ejecutarse cuando respondan todas
    Promise.all([
        buscarCitas(busqueda, re),
        buscarUsuario(busqueda, re)
    ]).then(respuestas => {
        res.status(200).json({
            ok: true,
            citas: respuestas[0],
            medicos: respuestas[1]
        })
    })

});
//=================================================
// Busqueda por colecciones
//=================================================
app.get('/coleccion/:tabla/:param', (req, res) => {

    var tabla = req.params.tabla;
    var busqueda = req.params.param;
    var promesa;


    var re = new RegExp(busqueda, 'i');

    switch (tabla) {
        case ('usuarios'):
            promesa = buscarUsuario(busqueda, re);
            break;
        case ('citas'):
            promesa = buscarCitas(busqueda, re);
            break;
        default:
            res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son: usuarios y citas',
                errors: { message: 'tipo de tabla/colección no válido.' }
            })
    }
    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        })
    })

})

function buscarCitas(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Cita.find({ pacienteId: regex })
            .populate('medicoId', 'nombre')
            .populate('pacienteId', 'nombre apellidos')
            .exec((err, citas) => {

                if (err) {
                    reject('Error al cargar citas', err);
                } else {
                    resolve(citas);
                }
            })
    })
}

// function buscarMedicos(busqueda, regex) {

//     return new Promise((resolve, reject) => {

//         Medico.find({ nombre: regex })
//             .populate('usuario', 'nombre email')
//             .populate('hospital')
//             .exec((err, medicos) => {

//                 if (err) {
//                     reject('Error al cargar medicos', err);
//                 } else {
//                     resolve(medicos);
//                 }
//             })
//     })
// }

function buscarUsuario(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find()
            .or([{ nombre: regex }, { apellidos: regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            })
    })
}





module.exports = app;