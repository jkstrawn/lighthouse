import Entity from "./entity";
import game from "../core/gameEngine";

export default class Rocket extends Entity {
    side: string;

    constructor(id: number, model: THREE.Object3D, position: THREE.Vector3) {
        super(id, model, position, 1);

        model.rotation.y = -Math.PI / 2;
        model.scale.set(2, 2, 2);
    }

    playDeathAnimation() {
        this.setRemoveFromWorld = true;
    }

    update(dt) {
        super.update(dt);
        if (this.dead) {
            return;
        }

        this.translateXandY(0, 2);

        if (this.model.position.z > 125) {
            game.hitEnemy();
            this.setKill = true;
        }
    }
}