import css from './style.css';

import * as PIXI from 'pixi.js';
import io from 'socket.io-client';
import Vue from 'vue';


// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
// let app = new PIXI.Application({ 
//   width: 800,         // default: 800
//   height: 600,        // default: 600
//   antialias: true,    // default: false
//   transparent: false, // default: false
//   resolution: 1       // default: 1
// });

// The application will create a canvas element for you that you
// can then insert into the DOM
//document.body.appendChild(app.view);

let socket = io(__SOCKET_URL__ || window.location.href);

socket.on('error', (error) => {
  console.log(error);
});

import MissileGame from '../commons/missile-game';

//set up canvas
const canvas = document.getElementById('game');
const ctx = canvas.getContext("2d");

var game = new MissileGame(canvas, ctx);

function setupCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

setupCanvas();
window.onresize = function() {
  game.resizeRender();
};

var hud = new Vue({ 
  el: '#hud',
  data: {
      message: 'Hello Vue!'
  }
});
