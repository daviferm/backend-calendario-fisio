var mongoose = require('mongoose');


var Schema = mongoose.Schema;


var citaSchema = new Schema({
    medicoId: {
        type: Schema.Types.ObjectId,
        ref: 'Medico'
    },
    pacienteId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: false
    },
    evento: {
        type: String,
        required: false
    },
    dia: {
        type: String,
        required: [true, 'El dia de la cita es requerido']
    },
    inicio: {
        type: String,
        required: [true, 'La hora de inicio es requerida']
    },
    final: {
        type: String,
        required: [true, 'Los minutos de inicio es requerido']
    },
    color: {
        type: String,
        required: [true, 'El color de la cita es requerida']
    },
    incidencia: {
        type: String,
        required: false
    }

}, { collection: 'Citas' });



module.exports = mongoose.model('Cita', citaSchema);