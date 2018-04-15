import Entity from "./entity";

export default class Missile extends Entity {
    constructor(id: number, model: THREE.Object3D, position: THREE.Vector3) {
        super(id, model, position, 1);

        this.rotateModel(Math.PI / 2);
    }

    update(dt) {
        super.update(dt);

        this.translateXandY(0, -1);        
    }
}