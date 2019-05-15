import path from 'path';
import express from 'express';
import socketIO from 'socket.io';

import GameServer from './gameserver';

const app = express(),
      DIST_DIR = path.join(__dirname, './client'),
      HTML_FILE = path.join(DIST_DIR, 'index.html');


app.use(express.static(DIST_DIR));

app.get('*', (req, res) => {
  res.sendFile(HTML_FILE);
});

const PORT = process.env.PORT || 3000;
let server = app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`);
    console.log('Press Ctrl+C to quit.');
});

var io = socketIO(server);

const gameServer = new GameServer(io);
gameServer.run();
