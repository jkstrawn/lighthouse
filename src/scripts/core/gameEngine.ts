import * as THREE from 'three';
import * as $ from 'jquery';
import Entity from '../entity/entity';
import renderer from '../graphics/renderer';
import audio from "../audio/audioPlayer";
import EntityDataModel from "../../../shared/network/fromServer/entityDataModel";
import EntityTypes from "../../../shared/entities/enum/entityTypeEnum";
import Network from "./_networkManager";
import Ui from "../ui/_userInterface";
import Input from "../ui/_input";

class GameEngine {

	debug: boolean = false;
	states: Array<Array<EntityDataModel>> = [];
	entities: Array<Entity> = [];
	username: string;
	player: Entity = null;

	constructor() {
	}

	init() {
		renderer.init();
		Network.connect();

		window["animate"]();
	}

	sendChat(message) {
		Network.sendChat(message);
	}

	createEntity(entity: EntityDataModel) {
		console.log("create new entity of type", entity.type);
		switch (entity.type) {
			case EntityTypes.Player:
				return this.createPlayer(entity);
		}
	}

	createPlayer(entity: EntityDataModel) {
		// let model = renderer.createAnimatedModel("man");
		// let position = new THREE.Vector3(entity.x, 0, entity.z);

		// console.log(entity);
		// let otherPlayer = new OtherPlayer(entity.id, entity.type, entity.username, model, position, entity.hp, entity.inventory);
		// this.entities.push(otherPlayer);
	}

	initiateThisPlayer(entity: EntityDataModel) {
		// called by network when the user logs in with a character

		let model = renderer.createAnimatedModel("man");
		let position = new THREE.Vector3(entity.x, 0, entity.z);

		this.player = new Entity(1, new THREE.Mesh(), new THREE.Vector3(), 4);
		
		console.log("make the player with id " + this.player.id);
		console.log(entity);
		
		window["a"] = model;
		
		this.username = entity.username;
		// this.entities.push(this.player);
		
		Ui.initiate(entity);
		// renderer.focusCameraOnPosition(this.player.getX(), this.player.getY());
	}

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

	onPlayerDied() {

	}

	handlePrivateData(data: EntityDataModel) {

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

	handleUpdatePacket(states: Array<EntityDataModel>) {
		this.states.push(states);
	}

	handleFullState(entities: Array<EntityDataModel>) {
		// reverse order so that we can delete the entity if required
		for (let i = entities.length - 1; i >= 0; i--) {
			this.updateEntityWithStateData(entities[i]);
		}

		// $('#users').empty();
		// for (let entity of data) {
		// 	if (entity.username) {
		// 		$('#users').append('<div>' + entity.username + '</div>');
		// 	}
		// }
	}

	updateEntityWithStateData(state: EntityDataModel) {
		if (this.player != null && this.player.id == state.id) {
			// this.player.useState(state);

			if (state.dead) {
				this.deleteEntity(this.player.id, true);
				this.player = null;
			}
			return;
		}

		let entity = this.entities.filter(x => x.id == state.id)[0];
		if (entity == null) {
			if (state.type) {
				return this.createEntity(state);
			}

			return;
		}

		entity.useState(state);
	}

	useState(dt: number) {
		while (this.states.length > 0) {
			let state = this.states.shift();

			if (state) {
				for (let entity of state) {
					this.updateEntityWithStateData(entity);
				}
			}
		}
	}

	render(dt) {
		renderer.render(dt);
	}

	update(dt) {
		this.useState(dt);
		this.updateEntities(dt);
		this.handleInput();

		Network.update(dt);
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