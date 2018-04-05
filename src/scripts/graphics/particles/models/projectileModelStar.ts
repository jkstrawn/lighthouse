import ProjectileModel from "./projectileModel";
import * as THREE from "three";
import assets from "../../core/assetLoader";
import particles from "../particleEngine";
import audio from '../../../audio/audioPlayer';
import Proton from "three.proton";

export default class ProjectileModelStar extends ProjectileModel {

    material1: THREE.SpriteMaterial;
    material2: THREE.SpriteMaterial;
    emitter: Proton.Emitter;

    constructor(type: string, position: THREE.Vector3) {
        super(type);

        this.material1 = new THREE.SpriteMaterial({ map: assets.getTexture("spikey"), color: 0xffffff });
        let sprite = new THREE.Sprite(this.material1)
        sprite.scale.set(10, 10, 1);

        this.material2 = new THREE.SpriteMaterial({ map: assets.getTexture("spikey"), color: 0xffffff });
        let sprite1 = new THREE.Sprite(this.material2)
        sprite1.scale.set(10, 10, 1);

        var material2 = new THREE.SpriteMaterial({ map: assets.getTexture("fuzz"), color: 0xff99ff });
        let sprite2 = new THREE.Sprite(material2)
        sprite2.scale.set(14, 14, 1);

        this.add(sprite);
        this.add(sprite1);
        this.add(sprite2);

        this.emitter = particles.starTrail(position);
    }

    delete() {
        super.delete();

        particles.starExplosion(this.position);

        this.emitter.disable();
    }

    update(dt: number) {
        this.emitter.position.value = this.emitter.position.value.set( this.position.x, this.position.y, this.position.z );

        this.material1.rotation += dt / 500;
        this.material2.rotation -= dt / 700;
    }
}