import ProjectileModel from "./projectileModel";
import * as THREE from "three";
import particles from "../particleEngine";
import audio from '../../../audio/audioPlayer';

export default class ProjectileModelSlime extends ProjectileModel {

    constructor(type: string) {
        super(type);

        let material = new THREE.MeshStandardMaterial({
            opacity: 0.7,
            transparent: true,
            color: 0x00ff22
        });

        let model = new THREE.Mesh(new THREE.SphereGeometry(4, 8, 8), material);
        this.add(model);
    }
    
    delete() {
        super.delete();
        
        particles.slimeExplosion(this.position);
    }

    update(dt: number) {
    }
}