var express = require('express');
var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
var Publicacion = require('../models/publicacion');

const SEED = require('../config/config').SEED;
const mdAutenticathion = require('../middlewares/autenticacion');

app.get('/', (req, resp, next) => {
    Publicacion.find({}, (err, data) => {
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

app.get('/:id', (req, resp, next) => {
    var id = req.params.id;
    Publicacion.findById(id, (err, data) => {
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

app.post('/', mdAutenticathion.verificaToken, (req, res) => {

    var publicacion = new Publicacion({
        titulo: req.body.titulo,
        cuerpo: req.body.cuerpo,
        publicado: req.body.publicado,
        fecha: Date.now(),
        keywords: req.body.keywords,
        img: req.body.img,
        usuario: req.body.usuario,
    });
    publicacion.save((err, publicacionSaved) => {
        if (err) {
            return res.status(400).send({
                ok: false,
                code: 2,
                mensaje: 'No se pudo guardar la nueva publicacion',
                err
            });
        }
        return res.status(201).send({
            ok: true,
            publicacionSaved
        });
    });
});

app.put('/:id', mdAutenticathion.verificaToken, (req, res) => {
    var id = req.params.id;
    Publicacion.findById(id, (err, publicacion) => {
        if (err) {
            return res.status(500).send({
                ok: false,
                code: 3,
                mensaje: 'Error del sistema, contacte al administrador o intente más tarde',
                errors: err
            });
        }
        if (!publicacion) {
            return res.status(404).send({
                ok: false,
                code: 4,
                mensaje: 'Recurso no encontrado',
            });
        }
        publicacion.titulo = req.body.titulo;
        publicacion.cuerpo = req.body.cuerpo;
        publicacion.publicado = req.body.publicado;
        publicacion.keywords = req.body.keywords;
        publicacion.img = req.body.img;
        publicacion.usuario = req.body.usuario;
        publicacion.save((err, publicacionSaved) => {
            if (err) {
                return res.status(400).send({
                    ok: false,
                    code: 2,
                    mensaje: 'Error al actualizar publicacion',
                    err
                });
            }
            return res.status(201).send({
                ok: true,
                publicacionSaved
            });
        });

    });
});

app.delete('/:id', mdAutenticathion.verificaToken, (req, res) => {
    var id = req.params.id;
    Publicacion.findByIdAndRemove(id, (err, deletedUser) => {
        if (err) {
            return res.status(400).send({
                ok: false,
                code: 5,
                mensaje: 'Error al eliminar publicacion',
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