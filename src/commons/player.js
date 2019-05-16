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

const NOCLIPTIME = 50;
const LIFESPAN = 500;

class Bullet {

  constructor(world, player, position, angle, e) {
    this.world = world;

    this.player = player;

    this.body = Bodies.rectangle(position.x , position.y, 7, 3, {
      angle: angle,
      //density: 0.001,
      //friction: 0.05,
      label: 'bullet',
      frictionAir: 0,
      //frictionStatic: 0.2,
      restitution: 0.25,
      //sleepThreshold: 30, //bullets despawn on sleep after __ cycles
      collisionFilter: {
        group: -2 //can't collide with player (at first)
      }
    });

    this.spawn = e.timestamp;

    const vel = 0.0025;
    const f = {
      x: vel * Math.cos(angle),
      y: vel * Math.sin(angle)
    };
    this.body.force = f;

    World.add(this.world, this.body);

    this.body.gameObject = this;

  }

  tick(e) {
    if (e.timestamp - this.spawn > NOCLIPTIME) {
      this.body.collisionFilter.group = 1;
    }
    if (e.timestamp - this.spawn > LIFESPAN) {
      this.player.bullets.splice( this.player.bullets.indexOf(this), 1 );
      World.remove(this.world, this.body);
    }
  }
}

export default class Player {

  constructor(world, x, y) {

    this.world = world;
    this.body = Bodies.circle(x, y, 20, {
      frictionAir: 0.05,
      label: 'player',
      collisionFilter: {
        group: 1 //can't collide with player (at first)
      }
    });

    this.moveForce = 0.005;

    this.lastshot = 0;
    this.equipedGun = {
      ammo: 300,
      ammoCapacity: 300,
      cooldown: 1000,
      precision: 0.9,
      reloadtime: 10000
    };
    this.bullets = [];

    World.add(this.world, this.body);

    this.body.gameObject = this;

  }

  tick(e) {
    this.bullets.forEach(bullet => {
      bullet.tick(e);
    });
    if (this.equipedGun.ammo <= 0 &&
      (e.timestamp - this.equipedGun.reloadingStart) > this.equipedGun.reloadtime) {
        this.equipedGun.ammo = this.equipedGun.ammoCapacity;
    }
  }

  move(force, boost) {
    this.body.force = {x:force.x * boost, y: force.y * boost};
  }

  look(position) {
    // console.log('fire', this.body.angle);
    this.body.angle = Math.atan2(
      position.y - this.body.position.y, 
      position.x - this.body.position.x);
  }

  fireBullet(e) {
    const fireAngle =  (Math.random() - 0.5) * (1 - this.equipedGun.precision) + this.body.angle;
    var bullet = new Bullet(this.world, this, this.body.position, fireAngle, e);
    this.bullets.push(bullet);
    this.equipedGun.ammo --;
    if (this.equipedGun.ammo <= 0) {
      this.equipedGun.reloadingStart = e.timestamp;
    }
  }
}
