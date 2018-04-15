import game from "./gameEngine";
import * as THREE from "three";
import MissileSide from "../enum/missileSideEnum";
import Entity from "../entity/entity";

export default class Enemy extends Entity {
    chanceBonus: number = 0;

    constructor(id: number, model: THREE.Object3D, position: THREE.Vector3) {
        super(id, model, position, 100);
    }

    update(dt: number) {
        if (Math.random() < .01 + this.chanceBonus) {
            this.chanceBonus = 0;
            let position = this.model.position;

            if (Math.random() < .5) {
                // left side
                game.createMissile(new THREE.Vector3(position.x + 40, position.y, position.z), MissileSide.Left);
            }
            else {
                // right side
                game.createMissile(new THREE.Vector3(position.x - 40, position.y, position.z), MissileSide.Right);
            }
        }
        else {
            this.chanceBonus += .0003;
        }
    }
}