import Entity from "./entity";
import MissileSide from "../enum/missileSideEnum";
import Ui from "../ui/_userInterface";
import game from "../core/gameEngine";

class Shields {
    left: number = 0;
    right: number = 0;
}

export default class Player extends Entity {

    shields: Shields = new Shields();
    lastUpdate: number = 0;
    
    constructor(id: number, model: THREE.Object3D, position: THREE.Vector3, health: number) {
        super(id, model, position, health);

        model.scale.set(6, 6, 6);
		model.rotation.y = Math.PI;

        Ui.PlayerHealth.updateHealth(this.maxHealth, this.health);
        Ui.ShieldEnergy.updateEnergy(this.shields.left, this.shields.right);
    }

    missileHit(side: string) {
        let shields = this.shields[side];

        if (shields <= 0) {
            this.takeDamage(side);
        } else {
            this.shields[side] = Math.max(0, this.shields[side] - 5);
            // Ui.ShieldEnergy.updateEnergy(this.shields.left, this.shields.right);
        }
    }

    takeDamage(side: string) {
        this.health -= 5;

        Ui.PlayerHealth.updateHealth(this.maxHealth, this.health);

        if (this.health <= 0) {
            game.gameover();
        }
    }

    fireGun() {
        game.createRocket(this.model.position);
    }

    increaseShield(side: string) {
        this.shields[side] += 35;

        Ui.ShieldEnergy.updateEnergy(this.shields.left, this.shields.right);
    }

    update(dt: number) {
        this.shields.left = Math.max(0, this.shields.left - .05);
        this.shields.right = Math.max(0, this.shields.right - .05);

        Ui.ShieldEnergy.updateEnergy(this.shields.left, this.shields.right);
    }
}