import Entity from "./entity";
import game from "../core/gameEngine";

export default class Missile extends Entity {
    side: string;

    constructor(id: number, model: THREE.Object3D, position: THREE.Vector3, side: string) {
        super(id, model, position, 1);

        this.side = side;

        this.rotateModel(Math.PI / 2);
    }

    playDeathAnimation() {
        this.setRemoveFromWorld = true;
    }

    update(dt) {
        super.update(dt);
        if (this.dead) {
            return;
        }

        this.translateXandY(0, -1);

        if (this.model.position.z < -75) {
            game.hitPlayer(this.side);
            this.setKill = true;
        }
    }
}