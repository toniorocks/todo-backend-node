var express = require('express');
var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
var Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;
const mdAutenticacion = require('../middlewares/autenticacion')

app.get('/renueva-token', mdAutenticacion.verificaToken,  (req, res) =>{
    var token = jwt.sign({usuario:req.usuario}, SEED, {expiresIn:14400})
    res.status(200).send({
        ok:true,
        usuario: req.usuario,
        token
    });
})

app.post('/obtain', (req, res) => {
    if (!req.body.usuario) {
        return res.status(400).send({ok:false,code:12,mensaje:"Bad request"});
    }
    var token = jwt.sign({usuario:req.usuario}, SEED, {expiresIn:14400});
    res.status(200).send({
        ok:true,
        token
    })
})

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    if (!req.body.password) {
        return res.status(400).send({ok:false,code:12,mensaje:"Bad request"});
    }

    Usuario.findOne({
        email:req.body.email
    }, async (err, usuario) => {
        if(err){
            return res.status(500).send({ok:false,code:10,mensaje:'Error de sistema, vuelva a intentarlo más tarde.'});
        }
        if (usuario) {

            if(usuario.confirmed == true){
                const auth = await bcrypt.compare(req.body.password, usuario.password);
                if (auth == true) {
                    var token = jwt.sign({
                        usuario: usuario
                    }, SEED,
                    {
                        expiresIn:14400
                    });
                    usuario.password = ':)';
                    return res.status(200).send({
                        ok:true,
                        usuario,
                        token
                    });    
                }
            }
            
        }
        return res.status(401).send({ok:false,code:11,mensaje:'Eso no ha funcionado, inténtelo de nuevo.'});
    });    
});
module.exports = app;