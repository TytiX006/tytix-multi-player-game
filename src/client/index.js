import * as PIXI from 'pixi.js';

import io from 'socket.io-client';


// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
let app = new PIXI.Application({ 
  width: 256,         // default: 800
  height: 256,        // default: 600
  antialias: true,    // default: false
  transparent: false, // default: false
  resolution: 1       // default: 1
});

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);

let socket = io();

socket.on('error', (error) => {
  console.log(error);
});
