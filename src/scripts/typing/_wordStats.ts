export default class WordStats {
    static wordsCompleted: number = 0;
    static timeBetweenWordsTotal: number = 0;
    static timeBetweenWordsCount: number = 0;

    static outputTimeBetween() {
        let average = this.timeBetweenWordsTotal / this.timeBetweenWordsCount;

        // console.log(`Count: ${this.timeBetweenWordsCount}. Average Time: ${average}`);
    }
}