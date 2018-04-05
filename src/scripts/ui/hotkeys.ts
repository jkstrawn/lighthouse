export default class Hotkeys {

	moveUp: number;
	moveLeft: number;
	moveDown: number;
	moveRight: number;
	spellFireball: number;
	swordWindUp: number;
	jump: number;

	constructor() {
		//dvorak
		// this.moveUp = 188;
		// this.moveLeft = 65;
		// this.moveDown = 79;
		// this.moveRight = 69;

		//qwerty
		this.moveUp = 87;			// W
		this.moveLeft = 65;			// A
		this.moveDown = 83;			// S
		this.moveRight = 68; 		// D
		this.spellFireball = 82;	// R
		this.swordWindUp = 69;		// E
		this.jump = 32;				// Space
	}
}