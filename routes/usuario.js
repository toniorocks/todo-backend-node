var express = require('express');
var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
var Usuario = require('../models/usuario');
var ActivationCode = require('../models/activation');
const bcrypt = require('bcrypt');
const SEED = require('../config/config').SEED;
const mdAutenticathion = require('../middlewares/autenticacion');

app.get('/', mdAutenticathion.verificaToken, (req, resp, next) => {

    Usuario.find({}, 'nombre email img role confirmed', (err, data) => {
        if (err) {
            return resp.status(500).send({
                ok: false,
                code: 1,
                mensaje: 'Error del sistema, contacte al administrador',
                errors: err
            });
        }
        return resp.status(200).send({
            ok: true,
            data
        });
    });
});

app.get('/:id', mdAutenticathion.verificaToken, (req, resp, next) => {
    var id = req.params.id;
    console.log('id', id);
    Usuario.findById(id, 'nombre email img role confirmed', (err, data) => {
        console.log('data', data);
        if (!!err) {
            return resp.status(500).send({
                ok: false,
                code: 1,
                mensaje: 'Error del sistema, contacte al administrador',
                errors: err
            });
        }
        return resp.status(200).send({
            ok: true,
            data
        });
    });
});

app.get('/activation/usuario/:id', mdAutenticathion.verificaToken, (req, resp, next) => {
    var id = req.params.id;
    console.log('id', id);
    ActivationCode.findOne({usuarioId:id}, 'usuarioId confirmed date', (err, data) => {
        console.log('data', data);
        if (!!err) {
            return resp.status(500).send({
                ok: false,
                code: 1,
                mensaje: 'Error del sistema, contacte al administrador',
                errors: err
            });
        }
        return resp.status(200).send({
            ok: true,
            data
        });
    });
});

app.put('/activation/activate/:id', mdAutenticathion.verificaToken, (req, resp, next) => {
    var id = req.params.id;
    var activationCode = req.body.activationCode;
    ActivationCode.find({id:id, activationCode:activationCode}, 'usuarioId activationCode confirmed date', (err, data) => {
        console.log('data', data);
        if (!!err) {
            return resp.status(500).send({
                ok: false,
                code: 1,
                mensaje: 'Error del sistema, contacte al administrador',
                errors: err
            });
        }
        return resp.status(200).send({
            ok: true,
            data
        });
        
    });
});

app.post('/', (req, res) => {

    var usuario = new Usuario({
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        img: req.body.img,
        role: req.body.role
    });
    usuario.save((err, usuarioSaved) => {
        if (err) {
            return res.status(400).send({
                ok: false,
                code: 2,
                mensaje: 'No se pudo guardar el nuevo usuario',
                err
            });
        }
        return res.status(201).send({
            ok: true,
            usuarioSaved,
            usuarioToken: req.usuario
        });
    });
});

app.put('/:id', mdAutenticathion.verificaToken, (req, res) => {
    var id = req.params.id;
    console.log('req.body',req.body)
    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).send({
                ok: false,
                code: 3,
                mensaje: 'Error del sistema, contacte al administrador',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(500).send({
                ok: false,
                code: 4,
                mensaje: 'Error del sistema, contacte al administrador',
                errors: { mensaje: 'No hay usuario con el id proporcionado' }
            });
        }

        usuario.nombre = req.body.nombre ? req.body.nombre : usuario.nombre;
        usuario.email = req.body.email ? req.body.email : usuario.email;
        usuario.role = req.body.role ? req.body.role : usuario.role;
        usuario.confirmed = req.body.confirmed ? req.body.confirmed : usuario.confirmed;  

        // usuario.nombre = req.body.nombre;
        // usuario.email = req.body.email;
        // usuario.role = req.body.role;
        usuario.save((err, usuarioSaved) => {
            if (err) {
                return res.status(400).send({
                    ok: false,
                    code: 2,
                    mensaje: 'Error al actualizar usuario',
                    err
                });
            }
            return res.status(201).send({
                ok: true,
                usuarioSaved
            });
        });

    });
});

app.delete('/:id', mdAutenticathion.verificaToken, (req, res) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, deletedUser) => {
        if (err) {
            return res.status(400).send({
                ok: false,
                code: 5,
                mensaje: 'Error al eliminar usuario',
                err
            });
        }
        return res.status(200).send({
            ok: true,
            deletedUser
        });
    });
});

module.exports = app;