// Requires
const express = require('express');
const colors = require('colors');
const mongoose = require('mongoose');


// Inicializar variables
let app = express();


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
mongoose.connect('mongodb://localhost:27017/fisioCalendarDB', { useNewUrlParser: true }, (err, res) => {

    if (err) throw err;

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
app.listen(3000, () => {
    console.log('Express corriendo en el puerto 3000 ', 'online'.green);
});