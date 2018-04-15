import game from "./gameEngine";
import * as THREE from "three";
import MissileSide from "../enum/missileSideEnum";

export default class Enemy {
    position: THREE.Vector3;
    chanceBonus: number = 0;

    constructor(position: THREE.Vector3) {
        this.position = position;
    }

    update(dt: number) {
        if (Math.random() < .01 + this.chanceBonus) {
            this.chanceBonus = 0;

            if (Math.random() < .5) {
                // left side
                game.createMissile(new THREE.Vector3(this.position.x + 40, this.position.y, this.position.z), MissileSide.Left);
            }
            else {
                // right side
                game.createMissile(new THREE.Vector3(this.position.x - 40, this.position.y, this.position.z), MissileSide.Right);
            }
        }
        else {
            this.chanceBonus += .0003;
        }
    }
}