import { Engine,
  Render,
  Runner,
  Composites,
  Common,
  MouseCMouseConstraint,
  Mouse,
  World,
  Events,
  Bodies } from 'matter-js';
  import Player from './player';
  import MissileLauncher from './missile-launcher';

const BOOSTINTERVAL = 200;

export default class MissileGame {

  constructor(canvas, ctx) {

    this.engine = Engine.create();
    this.world = this.engine.world;

    Events.on(this.engine, 'collisionEnd', this.collisionResolver.bind(this));
    // Events.on(this.engine, "collisionStart", this.collisionResolver.bind(this));

    this.world.gravity.y = 0;

    this.worldObjectFactory();

    // create runner
    this.runner = Runner.create();
    Runner.run(this.runner, this.engine);

    Events.on(this.runner, "tick", (e) => {
      this.gameLoop(e);
    });

    if (canvas) {
      this.createRender(canvas);
      this.ctx = ctx;
      this.keyBinds();
    }

  }

  createRender(canvas) {
    // create renderer
    this.render = Render.create({
      element: document.body,
      engine: this.engine,
      canvas: canvas,
      options: {
        showAngleIndicator: true,
        showVelocity: true
      }
    });

    Render.run(this.render);
  }

  resizeRender() {
    if (this.render) {
      this.render.canvas.height = window.innerHeight;
      this.render.canvas.width = window.innerWidth;
    }
  }

  keyBinds() {
    this.keyPresseds = [];
    this.keyPresseds[87] = {
      pressed: false,
      lastPressed: 0
    };
    this.keyPresseds[83] = {
      pressed: false,
      lastPressed: 0
    };
    this.keyPresseds[65] = {
      pressed: false,
      lastPressed: 0
    };
    this.keyPresseds[68] = {
      pressed: false,
      lastPressed: 0
    };

    window.onmousemove = (e) => {
      this.mouseMouve({x: e.clientX, y: e.clientY});
    };

    window.onmousedown = (e) => {
      this.mouseClick(e);
    };
    window.onmouseup = (e) => {
      this.mouseUnClick(e);
    };

    window.addEventListener('keydown', (e) => {
      this.keyPressed(e);
    });

    window.addEventListener('keyup', (e) => {
      this.keyUnPressed(e);
    });
  }

  mouseMouve(mousePosition) {
    this.player.look(mousePosition);
  }

  mouseClick(e) {
    this.mouseClicked = true;
  }

  mouseUnClick(e) {
    this.mouseClicked = false;
  }

  keyPressed(e) {
    var boost = 1;

    this.keyPresseds[e.keyCode].pressed =  true;

    var forceApplied = {x: 0, y: 0};

    // multi direction
    // up left
    if (this.keyPresseds[87].pressed && this.keyPresseds[65].pressed) {
      forceApplied.x = this.player.moveForce * 1/Math.sqrt(2) * -1;
      forceApplied.y = this.player.moveForce * 1/Math.sqrt(2) * -1;
    }
    // up right
    else if (this.keyPresseds[87].pressed && this.keyPresseds[68].pressed) {
      forceApplied.x = this.player.moveForce * 1/Math.sqrt(2) * +1;
      forceApplied.y = this.player.moveForce * 1/Math.sqrt(2) * -1;
    }
    // down left
    else if (this.keyPresseds[83].pressed && this.keyPresseds[65].pressed) {
      forceApplied.x = this.player.moveForce * 1/Math.sqrt(2) * -1;
      forceApplied.y = this.player.moveForce * 1/Math.sqrt(2) * +1;
    }
    // down right
    else if (this.keyPresseds[83].pressed && this.keyPresseds[68].pressed) {
      forceApplied.x = this.player.moveForce * 1/Math.sqrt(2) * +1;
      forceApplied.y = this.player.moveForce * 1/Math.sqrt(2) * +1;
    } else {
      // up
      if (this.keyPresseds[87].pressed) {

        forceApplied.y = this.player.moveForce * -1;

        if (e.timeStamp - this.keyPresseds[87].lastPressed < BOOSTINTERVAL) {
          boost = 10;
        }
      }
      // left
      if (this.keyPresseds[65].pressed) {
        forceApplied.x = this.player.moveForce * -1;
        if (e.timeStamp - this.keyPresseds[65].lastPressed < BOOSTINTERVAL) {
          boost = 10;
        }
      }
      // down
      if (this.keyPresseds[83].pressed) {
        forceApplied.y = this.player.moveForce * +1;
        if (e.timeStamp - this.keyPresseds[83].lastPressed < BOOSTINTERVAL) {
          boost = 10;
        }
      }
      // right
      if (this.keyPresseds[68].pressed) {
        forceApplied.x = this.player.moveForce * +1;
        if (e.timeStamp - this.keyPresseds[68].lastPressed < BOOSTINTERVAL) {
          boost = 10;
        }

      }
    }
    this.player.move(forceApplied, boost);
  }

  keyUnPressed(e) {
    console.log(e);
    this.keyPresseds[e.keyCode] = {
      pressed: false,
      lastPressed: e.timeStamp
    };
  }

  worldObjectFactory() {
    
    this.missileLauncher = new MissileLauncher(this.world, 200, 200);

    this.player = new Player(this.world, 500, 500);

    this.missileLauncher.setTarget(this.player);

  }

  collisionResolver(e) {
    // console.log('collision :', e.pairs);
      e.pairs.forEach(({ bodyA, bodyB }) => {
        if (bodyA !== this.player.body && bodyA !== this.missileLauncher.body) {
          World.remove(this.world, bodyA);
        }
        if (bodyB !== this.player.body && bodyB !== this.missileLauncher.body) {
          World.remove(this.world, bodyB);
        }
     });
   }

  gameLoop(e) {
    this.missileLauncher.tick(e);
    this.player.tick(e);
    if (this.mouseClicked && this.player.equipedGun.ammo > 0 && e.timestamp > this.player.lastshot + this.player.equipedGun.cooldown) {
      this.player.fireBullet(e);
    }
  }

}
