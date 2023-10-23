var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var activationScheme = new Schema({
    usuarioId: { type: String, unique:true, required: [true, 'El usuario es requerido.'] },
    activationCode: { type: String, required: [true, 'El código es requerido.'] },
    confirmed: { type: Boolean, required: [true, 'La confirmación es requerida.'] },
    date: { type: Date, required:[true, 'La fecha es requerida'] },
});

activationScheme.plugin(uniqueValidator, { messsage: '{PATH} Ya existe un activation code.' })
module.exports = mongoose.model('Activation', activationScheme);