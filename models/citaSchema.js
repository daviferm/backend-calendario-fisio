var mongoose = require('mongoose');


var Schema = mongoose.Schema;


var citaSchema = new Schema({
    medicoId: {
        type: Schema.Types.ObjectId,
        ref: 'Medico'
    },
    pacienteId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    dia: {
        type: String,
        required: [true, 'El dia de la cita es requerido']
    },
    inicio: {
        type: String,
        required: [true, 'La hora de inicio es requerida']
    },
    minutos: {
        type: String,
        required: [true, 'Los minutos de inicio es requerido']
    },
    duracion: {
        type: String,
        required: [true, 'La duración de la cita es requerida']
    },
    color: {
        type: String,
        required: [true, 'El color de la cita es requerida']
    }

}, { collection: 'Citas' });

// interface Citas {
//     id: string;
//     atendidoId: string;
//     pacienteId: string;
//     dia: string;
//     inicio: string;
//     minutos: string;
//     duracion: string;
//     color: string;
//   }





module.exports = mongoose.model('Cita', citaSchema);