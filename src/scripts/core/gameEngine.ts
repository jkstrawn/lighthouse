import * as THREE from 'three';
import * as $ from 'jquery';
import Entity from '../entity/entity';
import renderer from '../graphics/renderer';
import audio from "../audio/audioPlayer";
import Ui from "../ui/_userInterface";
import Input from "../ui/_input";

class GameEngine {

	debug: boolean = false;
	entities: Array<Entity> = [];
	username: string;
	player: Entity = null;

	constructor() {
	}

	init() {
		renderer.init();

		window["animate"]();
	}

	// initiateThisPlayer(entity: EntityDataModel) {
	// 	// called by network when the user logs in with a character

	// 	let model = renderer.createAnimatedModel("man");
	// 	let position = new THREE.Vector3(entity.x, 0, entity.z);

	// 	this.player = new Entity(1, new THREE.Mesh(), new THREE.Vector3(), 4);
		
	// 	console.log("make the player with id " + this.player.id);
	// 	console.log(entity);
		
	// 	window["a"] = model;
		
	// 	this.username = entity.username;
	// 	// this.entities.push(this.player);
		
	// 	Ui.initiate(entity);
	// 	// renderer.focusCameraOnPosition(this.player.getX(), this.player.getY());
	// }

	deleteEntity(id: number, wasKilled: boolean) {
		let entity = game.entities.filter(x => x.id == id)[0];
		if (entity) {
			if (wasKilled) {
				entity.setKill = true;
			} else {
				entity.setRemoveFromWorld = true;
			}
		}
	}

	handleInput() {
		if (this.player != null) {
			Input.handleInput();
		}
	}

	tryToMovePlayer(direction) {
		// if (this.player.canMove()) {
		// 	this.player.moveInDirection(direction);
		// }
	}

	updateEntities(dt: number) {
		for (let i = this.entities.length - 1; i >= 0; i--) {
			var entity = this.entities[i];

			if (entity.setRemoveFromWorld) {
				entity.delete();
				this.entities.splice(i, 1);
			} else {
				entity.update(dt);
			}
		}
	}

	render(dt) {
		renderer.render(dt);
	}

	update(dt) {
		this.updateEntities(dt);
		this.handleInput();

		renderer.update(dt);

		if (this.player) {
			// let playerState = this.player.getState();
			// if (playerState) {
			// 	Network.sendPlayerState(playerState);
			// }
		}

		if (this.debug) {
			for (let i = this.entities.length - 1; i >= 0; i--) {
				this.entities[i].updateDebug(dt);
			};
		}
	}
}

const game = new GameEngine();
export default game;