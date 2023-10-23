// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors'); // Import the cors module


// var appRoutes = require('./routes/app');
var loginRoutes = require('./routes/login');
var emailRoutes = require('./routes/email');
var registerRoutes = require('./routes/register');
var usuarioRoutes = require('./routes/usuario');

//init
var app = express();

// Allow all origins for testing purposes. You can configure it to allow only specific origins in production.
const corsOptions = {
    origin: '*',
    allowedHeaders: 'Authorization, Content-Type',
};
app.use(cors());

//bodyparser
app.use(bodyParser.urlencoded({extended:false}));   //application/x-www-form-urlencoded
app.use(bodyParser.json());                           //transformar petiiciones a json

//app.use('/publicacion', publicacionRoutes);
//app.use('/', appRoutes);
app.use('/login', loginRoutes);
app.use('/email', emailRoutes);
app.use('/register', registerRoutes);
app.use('/user', usuarioRoutes);


// Conexión a la base de datos
mongoose.connection.openUri('mongodb+srv://marco:e1kvoL5BjyPQtL5V@cluster0.0iohx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

//port
app.listen(3000, () => {
    console.log('Express server online --port=', 3000);
})
