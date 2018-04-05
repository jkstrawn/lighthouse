import * as Proton from "three.proton";
import * as THREE from "three";
import assets from "../core/assetLoader";
import HitGroundBehavior from "./hitGroundBehavior";
import * as SPE from "shader-particle-engine";

class ParticleEngine {

    proton: Proton;
    circleSprite: THREE.Sprite;
    sparkSprite: THREE.Sprite;
    scene: THREE.Scene;
    particleGroups: Array<any> = [];

    starExplosionGroup: any;
    starTailGroup: any;

    constructor() {
        this.proton = new Proton();
    }

    initialize(scene: THREE.Scene) {
        this.scene = scene;

        let circleMap = assets.getTexture("circle");
        let circleMaterial = new THREE.SpriteMaterial({
            map: circleMap,
            blending: THREE.AdditiveBlending
        });
        this.circleSprite = new THREE.Sprite(circleMaterial);


        let emitterSettings = {
            type: SPE.distributions.SPHERE,
            position: {
                spread: new THREE.Vector3(4),
                radius: 1,
            },
            acceleration: {
                value: new THREE.Vector3(-2)
            },
            velocity: {
                value: new THREE.Vector3(30),
                spread: 25
            },
            wiggle: {
                spread: 20
            },
            size: {
                value: [30, 0],
                spread: 25
            },
            color: {
                value: [new THREE.Color('#ff88ff'), new THREE.Color('#ff6600')]
            },
            particleCount: 50,
            alive: true,
            duration: 0.05,
            maxAge: {
                value: 1
            }
        };

        let particleGroup = new SPE.Group({
            texture: {
                value: assets.getTexture("spark")
            },
            blending: THREE.AdditiveBlending
        });
        this.starExplosionGroup = particleGroup;
        particleGroup.addPool(4, emitterSettings, false);
        // Add particle group to scene.
        scene.add(particleGroup.mesh);
        particleGroup.mesh.frustumCulled = false;




        let emitterSettings2 = {
            type: SPE.distributions.SPHERE,
            position: {
                spread: new THREE.Vector3(4),
                radius: 1,
            },
            acceleration: {
                value: new THREE.Vector3(-2)
            },
            velocity: {
                value: new THREE.Vector3(5),
                spread: 4
            },
            wiggle: {
                spread: 20
            },
            size: {
                value: [30, 0],
                spread: 25
            },
            color: {
                value: [new THREE.Color('#ff88ff'), new THREE.Color('#ff6600')]
            },
            particleCount: 50,
            alive: true,
            duration: 2,
            maxAge: {
                value: 1
            }
        };

        let particleGroup2 = new SPE.Group({
            texture: {
                value: assets.getTexture("spark")
            },
            blending: THREE.AdditiveBlending
        });
        this.starTailGroup = particleGroup2;
        particleGroup2.addPool(10, emitterSettings2, false);
        scene.add(particleGroup2.mesh);
        particleGroup2.mesh.frustumCulled = false;


        this.particleGroups.push(particleGroup);
        this.particleGroups.push(particleGroup2);
    }

    slimeExplosion(position) {
        let emitter = new Proton.Emitter();
        emitter.rate = new Proton.Rate(40, 1);
        emitter.addInitialize(new Proton.Body(this.circleSprite));
        emitter.addInitialize(new Proton.Mass(1));
        emitter.addInitialize(new Proton.Life(1, 2));
        emitter.addInitialize(new Proton.Position(new Proton.SphereZone(4)));
        emitter.addInitialize(new Proton.Velocity(new Proton.Span(140, 140), new Proton.Vector3D(0, 1, 0), 30));

        emitter.addBehaviour(new Proton.RandomDrift(10, 10, 10, .05));
        emitter.addBehaviour(new HitGroundBehavior());
        emitter.addBehaviour(new Proton.Scale(new Proton.Span(.5, 1), 0));
        emitter.addBehaviour(new Proton.Gravity(6));
        emitter.addBehaviour(new Proton.Color('#00ff26', ['#00ffff', '#11ffff'], Infinity, Proton.easeOutSine));
        emitter.p.x = position.x;
        emitter.p.y = position.y;
        emitter.p.z = position.z;
        emitter.emit('once', true);

        this.proton.addEmitter(emitter);
        this.proton.addRender(new Proton.SpriteRender(this.scene));
    }

    starTrail(position: THREE.Vector3): Proton.Emitter {

        this.starTailGroup.triggerPoolEmitter(1, position.clone());

        let activeEmitters = this.starTailGroup.emitters.filter(x => x.alive);
        if (!activeEmitters.length) {
            console.error("no emitter to return");
        }

        activeEmitters.sort(function (a, b) {
            return a.age - b.age;
        });

        let youngestEmitter = activeEmitters[0];

        return youngestEmitter;
    }

    starExplosion(position): Proton.Emitter {
        this.starExplosionGroup.triggerPoolEmitter(1, position.clone());
    }

    update(dt) {
        this.proton.update(dt / 1000);

        for (let group of this.particleGroups) {
            group.tick(dt / 1000);
        }
    }
}

const particles = new ParticleEngine();
export default particles;