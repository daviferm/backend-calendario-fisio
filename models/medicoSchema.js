var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;


var medicoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    },
    email: {
        type: String,
        unique: true,
        required: false
    },
    color: {
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
    telefono: {
        type: String,
        required: false
    },
    check: {
        type: Boolean,
        required: false
    }

}, { collection: 'Medicos' });


medicoSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

medicoSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Medico', medicoSchema);