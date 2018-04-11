import * as THREE from 'three';
import * as $ from 'jquery';
import Entity from '../entity/entity';
import renderer from '../graphics/renderer';
import audio from "../audio/audioPlayer";
import Ui from "../ui/_userInterface";
import Input from "../ui/_input";
import WordObject from '../ui/wordObject';

class GameEngine {

	debug: boolean = false;
	entities: Array<Entity> = [];
	username: string;
	player: Entity = null;
	allWords: Array<WordObject> = [];
	selectedWord: WordObject = null;

	constructor() {
		this.allWords = [
			new WordObject(1, "sentence", 200, 200),
			new WordObject(2, "waterfall", 200, 300)
		];		
	}

	init() {
		renderer.init();

		Ui.updateWordState(this.allWords);

		window["animate"]();
	}

	onKeyPress(key: string) {
		if (!this.selectedWord) {
			this.selectWord(key);
		}

		if (this.selectedWord) {
			this.selectedWord.onKeyPress(key);
		}

		Ui.updateWordState(this.allWords);
	}

	selectWord(key: string) {
		for (var word of this.allWords) {
			let letter = word.getNextLetter();
			if (letter == key) {
				this.selectedWord = word;
			}
		}
	}

	getWords(): Array<WordObject> {
		return this.allWords;
	}

	onWordCompleted(word: WordObject) {
		this.selectedWord = null;
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

		if (this.debug) {
			for (let i = this.entities.length - 1; i >= 0; i--) {
				this.entities[i].updateDebug(dt);
			};
		}
	}
}

const game = new GameEngine();
export default game;