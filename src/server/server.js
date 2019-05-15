import path from 'path';
import express from 'express';
import Server from 'http';
import socketIO from 'socket.io';
import GameServer from './gameserver';

const app = express(),
      DIST_DIR = path.join(__dirname, './client'),
      HTML_FILE = path.join(DIST_DIR, 'index.html');

var http = Server(app);
var io = socketIO(http);

app.use(express.static(DIST_DIR));

app.get('*', (req, res) => {
  res.sendFile(HTML_FILE);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`);
    const gameServer = new GameServer(io);
    gameServer.run();
    console.log('Press Ctrl+C to quit.');
});
