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
    img: {
        type: String,
        required: false
    },
    direccion: {
        type: String,
        required: false
    },
    nacimiento: {
        type: String,
        required: false
    },
    angiguedad: {
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