import game from "./gameEngine";
import * as THREE from "three";

export default class Enemy {
    position: THREE.Vector3;

    constructor(position: THREE.Vector3) {
        this.position = position;
    }

    update(dt: number) {
        if (Math.random() < .01) {
            if (Math.random() < .5) {
                // left side
                game.createMissile(new THREE.Vector3(this.position.x - 40, this.position.y, this.position.z));
            }
            else {
                // right side
                game.createMissile(new THREE.Vector3(this.position.x + 40, this.position.y, this.position.z));
            }
        }
    }
}