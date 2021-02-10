const { consultarJWT } = require("../utils/jwt");
const socketController = require('./../controllers/sockets');


class Sockets {

    constructor( io ) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        // On connection
        this.io.on('connection', async ( socket ) => {
            const [valid,uid] = consultarJWT(socket.handshake.query['Authorization'])
            
           //TODO: Validar JWT
           if (!valid) {
               console.log('Socket no identificado');
               return socket.disconnect();
           }

           //TODO: Saber que usuario esta activo
           await socketController.usuarioConectado(uid);

           //TODO: Emitir todos los usuarios conectados
           this.io.emit('lista-usuarios', await socketController.getUsuarios())

           //TODO: Socket join
           socket.join(uid); 

           //TODO: Cliente manda mensaje
           socket.on('mensaje-personal', async(mensaje) => {
               const message = await socketController.grabarMensaje(mensaje);
               this.io.to(mensaje.para).emit('mensaje-personal', message);
               this.io.to(mensaje.de).emit('mensaje-personal', message);
           });

           //TODO: Disconnect (marcar en la bd que se desconecto)
           socket.on('disconnect', async() => {
               await socketController.usuarioDesconectado(uid);
               this.io.emit('lista-usuarios', await socketController.getUsuarios())
           })
        
        });
    }


}


module.exports = Sockets;