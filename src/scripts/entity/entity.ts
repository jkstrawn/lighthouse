import renderer from '../graphics/renderer';
import audio from '../audio/audioPlayer';
import * as THREE from "three";

class DebugInfo {
	hitBox: THREE.Line;
	arrow: THREE.Line;
}

export default class Entity {

	id: number;
	model: THREE.Object3D;
	health: number;
	maxHealth: number;

	setRemoveFromWorld: boolean = false;
	setKill: boolean = false;
	dead: boolean = false;
	debugInfo: DebugInfo = new DebugInfo();
	hitboxSize: number = 10;

	constructor(id: number, model: THREE.Object3D, position: THREE.Vector3, health: number) {

		this.id = id;
		this.model = model;
		this.health = health;
		this.maxHealth = health;

		this.setPosition(position);
	}

	getX() {
		return this.model.position.x;
	}

	getY() {
		return this.model.position.z;
	}

	playDeathAnimation() { }

	translateXandY(x: number, y: number) {
		let dy = this.model.position.z += y;
		let dx = this.model.position.x += x;

		this.model.position.set(dx, this.model.position.y, dy);
	}

	setPosition(position: THREE.Vector3) {
		this.model.position.set(position.x, position.y, position.z);
	}

	rotateModel(angle: number) {
		this.model.rotation.y = angle;
	}

	rotateModelTo(position: THREE.Vector3) {
		let diff = position.clone().sub(this.model.position).normalize();
		let angle = new THREE.Vector2(diff.x, -diff.z).angle();

		this.rotateModel(angle);
	}

	delete() {
		console.log("deleting entity " + this.id);
		renderer.removeModel(this.model);
		this.deleteDebug();
	}

	checkKill() {
		if (this.setKill) {
			console.log("entity " + this.id + " is being removed");
			this.playDeathAnimation();

			this.setKill = false;
			this.dead = true;
		}
	}

	update(dt) {
		// if it has been 3 seconds since the last update then assume they have disconnectd, and delete the player
		// this.timeSinceUpdate += dt;
		// if (this.timeSinceUpdate > 3000) {
		// 	this.setRemoveFromWorld = true;
		// }

		this.checkKill();
		if (this.dead) {
			return;
		}
	}

	updateDebug(dt) {
		if (this.debugInfo.hitBox) {
			this.debugInfo.hitBox.position.set(this.getX(), 1.5, this.getY());
		} else {
			var segments = 64;
			var material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
			var geometry = new THREE.CircleGeometry(this.hitboxSize, segments);
			geometry.vertices.shift();

			this.debugInfo.hitBox = new THREE.Line(geometry, material)
			this.debugInfo.hitBox.rotation.x = -Math.PI / 2;
			renderer.scene.add(this.debugInfo.hitBox);
		}
	}

	deleteDebug() {
		if (this.debugInfo.hitBox) {
			renderer.removeModel(this.debugInfo.hitBox);
		}
	}
}