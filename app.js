// Requires
require('./config/config');
const express = require('express');
const colors = require('colors');
const mongoose = require('mongoose');
// var cors = require('cors');

// Inicializar variables
let app = express();

// CORS PARA CONTROLAR LAS PETICIONES QUE RECIBE NUESTRO BACKEND
app.use(function(req, res, next) {
    // res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, token-usuario");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    next();
});


// Libreria para manejar pas peticiones post
const bodyParser = require('body-parser');

// parse application/x - www - form - urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())

const appRoutes = require('./routes/app');
const usuarioRoutes = require('./routes/usuario');
const citaRoutes = require('./routes/citas');
const busquedaRoutes = require('./routes/busqueda');
const medicoRoutes = require('./routes/medico');
const uploadRoutes = require('./routes/upload');
const imagenesRoutes = require('./routes/imagenes');
const loginRoutes = require('./routes/login');



//Conectar la base de datos
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }, (err, res) => {

    if (err) {
        console.log('ERROR MONGO');
        return err;
    }
    // if (err) throw err;

    console.log('Base de datos ONLINE'.green);
});

// Otra forma de conectar a la base de datos mongo
// mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true }, (err, res) => {
//     if (err) throw err;

//     console.log('Base de datos ONLINE'.green);
// })

app.use('/usuario', usuarioRoutes);
app.use('/cita', citaRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);



// Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log('Express corriendo en el puerto 3000 ', 'online'.green);
});