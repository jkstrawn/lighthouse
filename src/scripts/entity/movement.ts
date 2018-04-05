import renderer from "../graphics/renderer";
import * as THREE from "three";
import { Dictionary } from "../../../shared/helpers/helpers";
import MapLogic from "../core/collision/mapLogic";

export default class Movement {

    movingDirections: Dictionary<number>;
    position: THREE.Vector3;
    moving: THREE.Vector2;
    speed = .04;
    lastMovingDirection = "N";

    constructor(position: THREE.Vector3) {
        this.movingDirections = {
            "N": 0,
            "E": 0,
            "S": 0,
            "W": 0
        };

        this.position = position;
        this.moving = new THREE.Vector2(0, 0);
    }

    isMoving(): boolean {
        return this.moving.x != 0 || this.moving.y != 0;
    }

    isMovingInDirection(direction: string): boolean {
        return this.movingDirections[direction] == 1;
    }

    stopMoving() {
        this.moving.x = 0;
        this.moving.y = 0;
    }

    stopInDirection(direction) {
        this.movingDirections[direction] = 0;
        this.calculateMoving();
    }

    moveInDirection(direction) {
        this.lastMovingDirection = direction;
        this.movingDirections[direction] = 1;

        this.calculateMoving();
    }

    calculateMoving() {
        this.moving.x = this.moving.y = 0;

        this.moving.y += this.movingDirections["N"];
        this.moving.x -= this.movingDirections["E"];
        this.moving.y -= this.movingDirections["S"];
        this.moving.x += this.movingDirections["W"];
    }

    getMovingAngle() {
        if (this.isMoving) {
            return new THREE.Vector2(this.moving.x, this.moving.y).angle() * -1;
        }

        return 0;
    }

    move(dt, callback) {
        if (this.isMoving()) {
            let direction = new THREE.Vector2(this.moving.x, this.moving.y);
            let distance = direction.normalize().multiplyScalar(dt * this.speed);
            let newPosition = this.position.clone().add(new THREE.Vector3(distance.x, 0, distance.y));

            let collision = MapLogic.checkCollision(this.position, newPosition, 5);
            this.position.set(collision.position.x, collision.position.y, collision.position.z);

            renderer.focusCameraOnPosition(this.position.x, this.position.z);

            callback(this.position);
        }
    }
}


