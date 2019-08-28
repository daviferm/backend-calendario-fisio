const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const app = express();

const Usuario = require('../models/usuarioSchema');
const Medico = require('../models/medicoSchema');

// default options
app.use(fileUpload());



// Rutas
app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos válidos de colección
    var tiposValidos = ['medicos', 'usuarios'];

    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            message: 'No es un tipo de colección válido.',
            errors: { message: 'Las colecciones válidas son: '.concat(tiposValidos) }
        });
    }


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No seleccionó nada.',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Solo aceptamos estas extensiones
    var extValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (!extValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            message: 'Extensión no válida.',
            errors: { message: 'Las extensiones válidas son: '.concat(extValidas) }
        });
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${extensionArchivo}`;

    // Mover el archivo del temporal a un path específico
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    // Mover el archivo a su carpeta
    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al guardar el archivo.',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res)

    })


});


function subirPorTipo(tipo, id, nombreArchivo, res) {


    switch (tipo) {
        case ('usuarios'):
            Usuario.findById(id, (err, usuario) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error al buscar el usuario.',
                        errors: err
                    });
                }
                if (!usuario) {
                    return res.status(400).json({
                        ok: false,
                        message: 'No existe un usuario con ese id.',
                        errors: { message: 'Usuario no existe.' }
                    });
                }
                var pathViejo = './uploads/usuarios/' + usuario.img;

                // Si existe elimina la imagen anterior
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }

                usuario.img = nombreArchivo;
                usuario.save((err, usuarioActualizado) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            message: 'Error al actualizar el usuario.',
                            errors: err
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de usuario actualizada.',
                        usuario: usuarioActualizado
                    })

                })

            })
            break;
        case ('medicos'):
            Medico.findById(id, (err, medico) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error al guardar la imagen en la base de datos.',
                        errors: err
                    });
                }
                if (!medico) {
                    return res.status(400).json({
                        ok: false,
                        message: 'No existe un médico con ese id.',
                        errors: { message: 'Médico no existe.' }
                    });
                }
                var pathViejo = './uploads/medicos/' + medico.img;

                // Si existe elimina la imagen anterior
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }

                medico.img = nombreArchivo;
                medico.save((err, medicoActualizado) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            message: 'Error al actualizar el medico.',
                            errors: err
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de medico actualizada.',
                        medico: medicoActualizado
                    })
                })
            })
            break;
    }

}


module.exports = app;