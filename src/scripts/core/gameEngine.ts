import * as THREE from 'three';
import * as $ from 'jquery';
import Entity from '../entity/entity';
import renderer from '../graphics/renderer';
import audio from "../audio/audioPlayer";
import Ui from "../ui/_userInterface";
import Input from "../ui/_input";
import WordObject from '../ui/wordObject';
import wordList from '../typing/wordList';
import WordStats from '../typing/_wordStats';
import assets from '../graphics/core/assetLoader';
import Enemy from './enemy';
import Missile from '../entity/missile';

class GameEngine {

	debug: boolean = false;
	entities: Array<Entity> = [];
	username: string;
	player: Entity = null;
	allWords: Array<WordObject> = [];
	selectedWord: WordObject = null;
	completedWords: Array<string> = [];
	lastWordCompletedAt: number;
	enemy: Enemy;
	nextId: number = 1;

	constructor() {

	}

	init() {
		renderer.init();

		assets.loadAssets(() => {
			// when assets have finished loading, let renderer know and then let the game engine know
			renderer.assetsLoaded();
		});

		this.allWords = [
			new WordObject(1, this.getRandomWord(), 150, 500),
			new WordObject(2, this.getRandomWord(), 400, 500),
			new WordObject(3, this.getRandomWord(), 650, 500)
		];

		Ui.updateWordState(this.allWords);

		this.enemy = new Enemy(new THREE.Vector3(0, 0, 130));

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
				this.onWordStart(word);
			}
		}
	}

	getWords(): Array<WordObject> {
		return this.allWords;
	}

	onWordStart(word: WordObject) {
		var millisecondsTaken = performance.now() - this.lastWordCompletedAt;

		if (millisecondsTaken < 1000) {
			WordStats.timeBetweenWordsCount++;
			WordStats.timeBetweenWordsTotal += millisecondsTaken;

			WordStats.outputTimeBetween();
		}
	}

	onWordCompleted(word: string, id: number, success: boolean) {
		
		if (success) {
			this.lastWordCompletedAt = performance.now();
			this.completedWords.push(word);

			if (id == 1) {
				this.activateLeftShield();
			}
			
			if (id == 2) {
				this.fireGun();
			}
			
			if (id == 3) {
				this.activateRightShield();
			}
		}

		this.selectedWord = null;
		console.log("update state");
		console.log(this.allWords[0].word);
		Ui.updateWordState(this.allWords);
	}

	getUnusedWord(currentLetter: string): string {
		let otherStartingLetters = this.allWords.reduce((a, b) => a.concat(b.getStartingLetters()), []).filter(x => x != currentLetter);
		let isValidWord = true;
		let randomWord = "";

		do {
			randomWord = this.getRandomWord();
			// console.log(`Got random word: ${randomWord} with other starting letters: ${otherStartingLetters}`);
			let isWordUsed = this.completedWords.some(x => x == randomWord);
			isValidWord = !isWordUsed && !otherStartingLetters.some(x => x == randomWord[0]);
			// if (!isValidWord) {
			// 	console.log(`Word is not valid!`);
			// }
		}
		while (!isValidWord);

		return randomWord;
	}

	getRandomWord(): string {
		let rand = Math.floor(Math.random() * wordList.length);
		return wordList[rand];
	}

	activateLeftShield() {
		console.log("left shield!");
	}

	activateRightShield() {
		console.log("right shield!");
	}

	fireGun() {
		console.log("fire gun!");
	}

	createMissile(position: THREE.Vector3) {
		let model = renderer.createModel("missile");
		let missile = new Missile(this.nextId++, model, position);

		this.addEntity(missile);
	}

	addEntity(entity: Entity) {
		this.entities.push(entity);
	}

	deleteEntity(id: number, wasKilled: boolean) {
		let entity = this.entities.filter(x => x.id == id)[0];
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
		this.enemy.update(dt);
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