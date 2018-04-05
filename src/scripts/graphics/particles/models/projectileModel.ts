import * as THREE from "three";
import audio from '../../../audio/audioPlayer';

export default class ProjectileModel extends THREE.Object3D {

    particleType: string;

    constructor(type) {
        super();

        this.particleType = type;
    }

    delete() {
        audio.playParticleHit(this.particleType, false);
    }

    update(dt: number) { }
}