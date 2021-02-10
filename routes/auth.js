const express = require('express');
const app = express.Router();
const authController = require('./../controllers/auth')
const { check, validationResult } = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validar-JWT');

//CREAR NUEVOS USUARIOS
app.post('/new', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty().isString(),
    check('password', 'El password es obligatorio').not().isEmpty().isString(),
    check('email', 'El email es obligatorio').not().isEmpty().isEmail(),
    validarCampos
],authController.crearUsuario);

//LOGIN
app.post('/',[
    check('email', 'El email es obligatorio').isEmail(),
    check('password','El password es obligatorio').not().isEmpty(),
],authController.login);

//RENOVAR TOKEN
app.get('/renew',[
    validarJWT
], authController.renewToken)

module.exports = app;