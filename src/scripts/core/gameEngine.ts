import * as THREE from 'three';
import * as $ from 'jquery';
import Entity from '../entity/entity';
import renderer from '../graphics/renderer';
import audio from "../audio/audioPlayer";
import Ui from "../ui/_userInterface";
import Input from "../ui/_input";
import WordObject from '../typing/wordObject';
import wordList from '../typing/wordList';
import WordStats from '../typing/_wordStats';
import assets from '../graphics/core/assetLoader';
import Enemy from './enemy';
import Missile from '../entity/missile';
import Player from '../entity/player';
import MissileSide from '../enum/missileSideEnum';
import Rocket from '../entity/rocket';

class GameEngine {

	debug: boolean = false;
	entities: Array<Entity> = [];
	username: string;
	player: Player = null;
	allWords: Array<WordObject> = [];
	selectedWord: WordObject = null;
	completedWords: Array<string> = [];
	lastWordCompletedAt: number;
	enemy: Enemy;
	nextId: number = 1;
	paused: boolean;

	constructor() {

	}

	init() {
		renderer.init();

		assets.loadAssets(() => {
			// when assets have finished loading, let renderer know and then let the game engine know
			renderer.assetsLoaded();
			this.assetsLoaded();
		});

		this.allWords = [
			new WordObject(1, this.getRandomWord(), 20, -120),
			new WordObject(2, this.getRandomWord(), 0, -210),
			new WordObject(3, this.getRandomWord(), -20, -120)
		];

		Ui.updateWordState(this.allWords);

		window["animate"]();
	}

	assetsLoaded() {
		let playerModel = renderer.createModel("spaceship");
		this.player = new Player(this.nextId++, playerModel, new THREE.Vector3(0, 0, -75), 100);

		this.addEntity(this.player);

		let enemyModel = renderer.createModel("enemy");
		this.enemy = new Enemy(this.nextId++, enemyModel, new THREE.Vector3(0, 0, 130));

		this.addEntity(this.enemy);
	}

	restart() {
		for (var entity of this.entities) {
			entity.delete();
		}

		this.entities = [];
		this.paused = false;

		this.assetsLoaded();
	}

	gameover() {
		this.paused = true;
		Ui.GameOver.show();
	}

	winning() {
		this.paused = true;
		Ui.GameWon.show();
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
				this.player.increaseShield(MissileSide.Left);
			}

			if (id == 2) {
				this.player.fireGun();
			}

			if (id == 3) {
				this.player.increaseShield(MissileSide.Right);
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
		let repititions = 0;

		do {
			repititions++;
			if (repititions > 200) {
				this.completedWords = [];
			}

			randomWord = this.getRandomWord();
			let isWordUsed = this.completedWords.some(x => x == randomWord);
			isValidWord = !isWordUsed && !otherStartingLetters.some(x => x == randomWord[0]);
			if (randomWord.length != 5) {
				isValidWord = false;
			}
		}
		while (!isValidWord);

		console.log(repititions);
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

	createMissile(position: THREE.Vector3, side: string) {
		let model = renderer.createModel("missile");
		let missile = new Missile(this.nextId++, model, position, side);

		this.addEntity(missile);
	}

	createRocket(position: THREE.Vector3) {
		let model = renderer.createModel("rocket");
		let rocket = new Rocket(this.nextId++, model, position);

		this.addEntity(rocket);
	}

	hitPlayer(side: string) {
		this.player.missileHit(side);
	}

	hitEnemy() {
		this.enemy.rocketHit();
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
		if (this.paused) {
			return;
		}

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