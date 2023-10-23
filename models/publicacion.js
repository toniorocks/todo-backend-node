var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var publicacionSchema = new Schema({
    titulo: { type: String, unique:true, required: [true, 'El título es requerido.'] },
    cuerpo: { type: String, required: [true, 'El cuerpo es requerido.'] },
    publicado: { type: Boolean },
    fecha: { type: Date, required:[true, 'La fecha es requerida'] },
    keywords: { type: String, required: false },
    img: { type: String, required: false },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario es obligatorio']
    }
});
publicacionSchema.plugin(uniqueValidator, { messsage: '{PATH} Ya existe una publicación con ese nombre.' })
module.exports = mongoose.model('Publicacion', publicacionSchema);