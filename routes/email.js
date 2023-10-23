var express = require('express');
const nodemailer = require("nodemailer");

var app = express();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});
const mdAutenticathion = require('../middlewares/autenticacion');

var ActivationCode = require('../models/activation');
var Usuario = require('../models/usuario');

app.post('/', mdAutenticathion.verificaToken, (req, res) => {
    const datos = req.body;
    if (!datos || !datos.email || !datos.subject) {
        return res.status(400).send({
            fail: 'Something went wrong'
        });
    }

    const transporter = nodemailer.createTransport({
        host: require('../config/config').HOST,
        port: require('../config/config').PORT,
        secure: require('../config/config').SECURE,
        auth: {
            user: require('../config/config').USER,
            pass: require('../config/config').PASS
        }
    })

    var generateRandomString = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';

        for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        return result;
    }

    const successCode = generateRandomString();

    Usuario.findOne({
        email:req.body.email
    }, async (err, usuario) => {
        if(err){
            return res.status(500).send({ok:false,code:10,mensaje:'Error de sistema, vuelva a intentarlo más tarde.'});
        }

        const actCod = new ActivationCode({
            usuarioId:usuario._id,
            activationCode: successCode,
            confirmed:false,
            date: new Date()
        })

        actCod.save(async (err, savedItem) => {
            if(err){
                return res.status(500).send({ok:false,code:10,mensaje:err});
            }
            transporter.sendMail({
                from: require('../config/config').FROM, // sender address
                to: require('../config/config').TO, // list of receivers
                subject: "Message from mi-acceso", // Subject line
                text: `Se ha registrado su correo electrónico en Mi-Acceso, para confirmar su registro por favor ingrese el siguiente código:\n
                    Código: ${successCode} \n
                `, // plain text body
                html: `
                <p>Se ha registrado su correo electrónico en Mi-Acceso, para confirmar su registro por favor ingrese el siguiente código:</p>
                    <p><b>Código</b>: ${successCode} </p>
                `, // html body
            }, (err, info) => {
                if(!err){
                    return res.status(200).send({
                        savedItem,
                        info
                    });
                }else{
                    return res.status(500).send({
                        err
                    })
                }
            });
        })

    })



});
module.exports = app;
