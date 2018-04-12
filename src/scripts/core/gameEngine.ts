import * as THREE from 'three';
import * as $ from 'jquery';
import Entity from '../entity/entity';
import renderer from '../graphics/renderer';
import audio from "../audio/audioPlayer";
import Ui from "../ui/_userInterface";
import Input from "../ui/_input";
import WordObject from '../ui/wordObject';
import wordList from '../typing/wordList';

class GameEngine {

	debug: boolean = false;
	entities: Array<Entity> = [];
	username: string;
	player: Entity = null;
	allWords: Array<WordObject> = [];
	selectedWord: WordObject = null;
	completedWords: Array<string> = [];

	constructor() {
		this.allWords = [
			new WordObject(1, "associate", 150, 500),
			new WordObject(2, "waterfall", 400, 500),
			new WordObject(3, "cabbage", 650, 500)
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
		this.completedWords.push(word.word);

		this.selectedWord = null;
	}

	getUnusedWord(currentWord: string): string {
		let otherStartingLetters = this.allWords.map(x => x.word).filter(x => x != currentWord).map(x => x[0]);
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