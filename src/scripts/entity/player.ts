import Entity from "./entity";
import MissileSide from "../enum/missileSideEnum";
import Ui from "../ui/_userInterface";
import game from "../core/gameEngine";

class Shields {
    left: number = 50;
    right: number = 50;
}

export default class Player extends Entity {

    shields: Shields = new Shields();
    lastUpdate: number = 0;
    
    constructor(id: number, model: THREE.Object3D, position: THREE.Vector3, health: number) {
        super(id, model, position, health);

        Ui.PlayerHealth.updateHealth(this.maxHealth, this.health);
        Ui.ShieldEnergy.updateEnergy(this.shields.left, this.shields.right);
    }

    missileHit(side: string) {
        let shields = this.shields[side];

        if (shields <= 0) {
            this.takeDamage(side);
        } else {
            this.shields[side] = Math.max(0, this.shields[side] - 2);
            Ui.ShieldEnergy.updateEnergy(this.shields.left, this.shields.right);
        }
    }

    takeDamage(side: string) {
        //this.health -= 2;
        this.health -= 10;

        Ui.PlayerHealth.updateHealth(this.maxHealth, this.health);

        if (this.health <= 0) {
            game.gameover();
        }
    }

    fireGun() {

    }

    increaseShield(side: string) {
        this.shields[side] += 15;

        Ui.ShieldEnergy.updateEnergy(this.shields.left, this.shields.right);
    }

    update(dt: number) {
        this.shields.left = Math.max(0, this.shields.left - .06);
        this.shields.right = Math.max(0, this.shields.right - .06);

        Ui.ShieldEnergy.updateEnergy(this.shields.left, this.shields.right);
    }
}