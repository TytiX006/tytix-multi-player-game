import { Engine,
  Render,
  Runner,
  Composites,
  Common,
  MouseCMouseConstraint,
  Mouse,
  World,
  Events,
  Bodies,
  Body } from 'matter-js';

const NOCLIPTIME = 1000;

class Missile {

  constructor(world, x, y, target, e) {
    this.world = world;

    this.target = target;

    this.body = Bodies.rectangle(x, y, 20, 5, {
      frictionAir: 0.01,
      label: 'missile',
      collisionFilter: {
        group: -1
      }
    });
    World.add(world, this.body);

    this.spawn = e.timestamp;

    this.body.gameObject = this;

  }

  tick(e) {
    if (e.timestamp - this.spawn > NOCLIPTIME ) {
      this.body.collisionFilter.group = 1;
    }
    this.body.angle = Math.atan2(
      this.target.body.position.y - this.body.position.y, 
      this.target.body.position.x - this.body.position.x);

    const vel = 0.00005;
    const f = {
      x: vel * Math.cos(this.body.angle),
      y: vel * Math.sin(this.body.angle)
    };
    this.body.force = f;
  }
}

export default class MissileLauncher {

  constructor(world, x, y) {
    this.world = world;

    this.missiles = [];
    this.lastshot = 0;
    this.body = Bodies.rectangle(x, y, 40, 40, {
      collisionFilter: {
        group: -1
      }
    });

    World.add(world, this.body);

    this.body.gameObject = this;
  }

  setTarget(target) {
    this.target = target;
  }

  tick(e) {
    // fire every x sec
    if ( e.timestamp > this.lastshot + 2500 ) {
      this.fireMissile(e);
      this.lastshot = e.timestamp;
    }
    this.missiles.forEach(missile => {
      missile.tick(e);
    });
  }

  fireMissile(e) {
    this.missiles.push(new Missile(this.world, this.body.position.x, this.body.position.y, this.target, e));
  }

}