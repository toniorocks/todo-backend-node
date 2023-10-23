 var mongoose = require('mongoose');
 var uniqueValidator = require('mongoose-unique-validator');
 var Schema = mongoose.Schema;
 var rolesValidos = {
	 values:['USER_ROLE', 'ADMIN_ROLE'],
	 message: '{VALUE} no es un rol válido.'
 }
 var usuarioSchema = new Schema({
 	nombre:{type:String, required:[true, 'El nombre es requerido.']},
 	email:{type:String, unique:true, required:[true, 'El correo es requerido.']},
 	password:{type:String, required:[true, 'El password es requerido.']},
 	img:{type:String, required:false},
 	role:{type:String, required: true, default:'USER_ROLE', enum: rolesValidos},
	confirmed:{type:String, required: false, default:false}
 });
 usuarioSchema.plugin(uniqueValidator, {messsage:'{PATH} Debe ser único.'})
 module.exports = mongoose.model('Usuario', usuarioSchema);