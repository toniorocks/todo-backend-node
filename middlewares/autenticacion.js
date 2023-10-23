const SEED = require('../config/config').SEED;
const jwt = require('jsonwebtoken');

exports.verificaToken = function(req,res,next){


    if(!req.headers.authorization){
        return res.status(403).send({
            ok: false,
            code: 3,
            mensaje: 'No es bienvenido aquí >=('
        })
    }
    //console.log(req.headers.authorization.substr(7));
    jwt.verify(req.headers.authorization.substr(7), SEED, (err, decoded) => {
        if(err){
            return res.status(401).send({
                ok: false,
                code: 2,
                mensaje: 'No es bienvenido aquí >=('
            });
        }
        req.usuario = decoded.usuario;
        next();
    });

}