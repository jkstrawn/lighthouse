import game from "../core/gameEngine";

export default class WordObject {
    id: number;
    word: string;
    x: number;
    y: number;
    index: number = 0;

    constructor(id: number, word: string, x: number, y: number) {
        this.word = word;
        this.id = id;
        this.x = x;
        this.y = y;
    }

    onKeyPress(key: string) {
        let nextLetter = this.getNextLetter();

        if (nextLetter == key) {
            this.index++;

            if (this.index >= this.word.length) {
                this.resetWord();
            }

            return;
        }

        // record wrong letter
    }

	getNextLetter(): string {
		return this.word[this.index];
    }
    
    resetWord() {
        game.onWordCompleted(this);

        this.word = game.getUnusedWord(this.word);
        this.index = 0;
    }
}