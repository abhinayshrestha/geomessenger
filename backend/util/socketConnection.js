let io;

module.exports = {
    init : httpServer => {
         const io = require('socket.io')(httpServer);
         return io;
    },
    getIO : () => {
        if(!io){
            throw new Error('Socket connection not initialized!!!');
        }
        else {
            return io;
        }
    } 
}