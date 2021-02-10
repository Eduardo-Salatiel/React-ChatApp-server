const Usuario = require('./../models/ususario');
const Mensaje = require('./../models/mensaje');

exports.usuarioConectado = async(uid)=> {
    const usuario = await Usuario.findById(uid);
    usuario.online = true;
    await usuario.save();

    return usuario;
}

exports.usuarioDesconectado = async(uid) => {
    const usuario = await Usuario.findById(uid);
    usuario.online = false;
    await usuario.save();

    return usuario;
}

exports.getUsuarios = async() => {
    const usuarios = await Usuario.find().sort('-online');
    return usuarios;
}

exports.grabarMensaje = async(mensaje) => {
    try {
        const mensajeDB = new Mensaje(mensaje);
        await mensajeDB.save();

        return mensajeDB;
    } catch (error) {
        console.log(error);
        return false;
    }
}