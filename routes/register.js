var express = require('express');
var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
var Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const mdAutenticacion = require('../middlewares/autenticacion');

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    const postedUser = new Usuario(req.body.usuario);
    bcrypt.hash(postedUser.password, 5, (err, hash) => {
        if(err){
            return res.status(400).send({
                ok: false,
                mensaje: 'No se pudo guardar [err:01].',
                err: err
            });
        }
        postedUser.password = hash;
        postedUser.save((err, savedItem) => {
            if (err){
                return res.status(400).send({
                    ok: false,
                    mensaje: 'No se pudo guardar [err:02].',
                    err: err
                });
            }
            return res.status(200).send({
                ok: true,
                savedItem
            });
        });
    })
});

app.post('/checkEmail', mdAutenticacion.verificaToken, (req, res) => {
    if(req.body.email){

        const email = req.body.email;
        Usuario.findOne({email:email}).then((user) => {
            return res.status(200).send(user);
        }).catch((error) => {
            return res.status(400).send({
                ok: false,
                mensaje: 'No found',
                error
            });
        });
        //

    }else {
        return res.status(400).send({
            ok: false,
            mensaje: 'Bad request',
            err
        });
    }
})

module.exports = app;