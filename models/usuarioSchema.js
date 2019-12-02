const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;


let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    apellidos: {
        type: String,
        required: [true, 'Los apellidos son necesarios']
    },
    email: {
        type: String,
        unique: [true, 'El correo es necesario'],
        required: true
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono es necesario']
    },
    genero: {
        type: String,
        required: [true, 'El género es necesario']
    },
    nacimiento: {
        type: String,
        required: false
    },
    img: {
        type: String,
        required: false
    },
    direccion: {
        type: String,
        required: false
    },
    codigoPostal: {
        type: String,
        required: false
    },
    ciudad: {
        type: String,
        required: false
    },
    provincia: {
        type: String,
        required: false
    },
    antiguedad: {
        type: String,
        required: false
    },
    observaciones: {
        type: String,
        required: false
    },
}, { collection: 'Usuarios' });


usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });


module.exports = mongoose.model('Usuario', usuarioSchema);