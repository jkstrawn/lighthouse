import game from "../core/gameEngine";

export default class WordObject {
    id: number;
    word: string;
    x: number;
    y: number;
    index: number = 0;
    timeStarted: number;
    nextWord: string;
    finished: boolean;
    typoDelay = 150;

    constructor(id: number, word: string, x: number, y: number) {
        this.word = word;
        this.id = id;
        this.x = x;
        this.y = y;

        this.nextWord = game.getUnusedWord(null);
    }

    onKeyPress(key: string) {
        if (this.finished) {
            if (key == " ") {
                this.onSuccess();
            }
            return;
        }

        let nextLetter = this.getNextLetter();

        if (nextLetter != key) {
            // record wrong letter
            this.finished = true;
            console.log(`WRONG! Word is '${this.word}' with letter '${key}'`);

            return setTimeout(() => {
                this.onFailure();
            }, this.typoDelay);
        }

        if (this.index == 0) {
            this.onStart();
        }

        this.index++;

        if (this.index >= this.word.length) {
            this.finished = true;
        }
    }

    getNextLetter(): string {
        return this.word[this.index];
    }

    getStartingLetters(): Array<string> {
        return [this.word[0], this.nextWord[0]];
    }

    onStart() {
        this.timeStarted = performance.now();
    }

    onSuccess() {
        this.reset(true);
    }

    onFailure() {
        this.reset(false);
    }

    reset(success: boolean) {
        let milliseconds = performance.now() - this.timeStarted;
        let lastWord = this.word;

        this.word = this.nextWord;
        this.nextWord = game.getUnusedWord(this.word[0]);
        this.index = 0;
        this.finished = false;

        game.onWordCompleted(lastWord, this.id, success);
    }
}