const { response } = require("express");
const { validationResult } = require("express-validator");
const Usuario = require("../models/ususario");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../utils/jwt");

exports.crearUsuario = async (req, res = response) => {
  try {
    const { email, password } = req.body;

    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya existe",
      });
    }

    const usuario = new Usuario(req.body);
    //ENCRIPTAR CONTRASEÑA
    usuario.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    await usuario.save();

    const token = await generarJWT(usuario.id);

    res.json({
      ok: true,
      usuario,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
    });
  }
};

exports.login = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const usuarioDB = await Usuario.findOne({ email });

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "Email no encontrado",
      });
    }
    const validPassword = bcrypt.compareSync(password, usuarioDB.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Correo o contraseña incorrecta",
      });
    }
    //GENERAR JWT
    const token = await generarJWT(usuarioDB.id);

    return res.json({
      ok: true,
      usuario: usuarioDB,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
    });
  }
};
exports.renewToken = async (req, res = response) => {
  const uid = req.uid;
  const token = await generarJWT(uid);
  const usuario = await Usuario.findById(uid)

  res.json({
    ok: true,
    token,
    usuario
  });
};
