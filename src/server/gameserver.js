
export default class GameServer {
  
  constructor(io) {
    this.socket = io;
    io.on('connection', this.connection().bind(this));
  }

  connection(socket) {
    console.log('Client connected');
    socket.on('disconnect', this.disconnect().bind(this));
  }

  disconnect() {
    console.log('Client disconnected');
  }

  run() {
  }
}
