const express = require('express');
const { validarJWT } = require('../middlewares/validar-JWT');
const app = express.Router();
const mensajesController = require('./../controllers/mensajes');

app.get('/:de', validarJWT, mensajesController.obtenerChat)

module.exports = app;