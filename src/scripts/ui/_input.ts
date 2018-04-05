import Hotkeys from './hotkeys';
import renderer from '../graphics/renderer';
import game from "../core/gameEngine";
import Npc from "../entity/npc";
import * as THREE from "three";
import Spells from "../../../shared/spells/spellEnum";
import Ui from "./_userInterface";
import audio from "../audio/audioPlayer";

export default class Input {

    static click: THREE.Vector2;
    static rClick: THREE.Vector2;
    static relativeMouse: THREE.Vector2;
    static mouse: THREE.Vector2;

    static hoveredMerchant: Npc;
    static blocking: boolean;
    static castingSpell: number;
    static cursors: Array<string> = [];

    static keyDownList: Array<Number> = [];
    static keyUpList: Array<number> = [];

    static hotkeys = new Hotkeys();

    static onKeyDown(keyCode: number) {
        if (this.keyDownList.indexOf(keyCode) == -1) {
            this.keyDownList.push(keyCode);
        }
    }

    static onKeyUp(keyCode: number) {
        if (this.keyUpList.indexOf(keyCode) == -1) {
            this.keyUpList.push(keyCode);
        }
    }

    static getXandY(e) {
        let x = e.clientX - renderer.renderer.context.canvas.clientLeft;
        let y = e.clientY - renderer.renderer.context.canvas.clientTop;
        return new THREE.Vector2(x, y);
    }

    static getRelativeXandY(e) {
        let x = e.clientX - renderer.renderer.context.canvas.clientLeft;
        let y = e.clientY - renderer.renderer.context.canvas.clientTop;

        let diffX = x - renderer.renderer.context.canvas.width / 2;
        let diffY = y - renderer.renderer.context.canvas.height / 2;

        return new THREE.Vector2(diffX, diffY * -1);
    }

    static mouseMove(e: React.MouseEvent<HTMLDivElement>) {
        this.mouse = this.getXandY(e);
        this.relativeMouse = this.getRelativeXandY(e);

        this.hoveredMerchant = game.getMerchantUnderMouse(this.mouse);
        let shouldSet = this.hoveredMerchant != null;
        this.setCursorTo("pointer", shouldSet);
    }

    static onLeftClick(e: React.MouseEvent<HTMLDivElement>) {
        this.click = this.getXandY(e);

        if (this.castingSpell > 0) {
            let worldCoords = renderer.getMousePositionByZ(this.click);
            game.castSpell(this.castingSpell, this.click, worldCoords);
            this.cancelSpell();
            return;
        }

        game.setAttack(this.click.x, this.click.y);
    }

    static onRightMouseDown(e) {
        this.rClick = this.getXandY(e);

        if (this.hoveredMerchant) {
            return;
        }

        this.blocking = true;
        game.startPlayerBlocking(this.rClick.x, this.rClick.y);
    }

    static onRightMouseUp(e) {
        if (this.blocking) {
            this.blocking = false;
            game.stopPlayerBlocking();
        }

        if (this.hoveredMerchant) {
            Ui.NpcVendor.open(this.hoveredMerchant.npcId);

            audio.playSoundBuffer("coins");
        }
    }

    static handleInput() {
        this.handleKeyDown();
        this.handleKeyUp();

        this.resetInput();
    }

    static handleKeyDown() {
        for (let i = 0; i < this.keyDownList.length; i++) {
            switch (this.keyDownList[i]) {
                case this.hotkeys.moveUp:
                    game.tryToMovePlayer("N");
                    break;
                case this.hotkeys.moveRight:
                    game.tryToMovePlayer("E");
                    break;
                case this.hotkeys.moveDown:
                    game.tryToMovePlayer("S");
                    break;
                case this.hotkeys.moveLeft:
                    game.tryToMovePlayer("W");
                    break;
            }
        }
    }

    static handleKeyUp() {
        for (let i = 0; i < this.keyUpList.length; i++) {
            switch (this.keyUpList[i]) {
                case this.hotkeys.moveUp:
                    game.tryToStopPlayer("N");
                    break;
                case this.hotkeys.moveRight:
                    game.tryToStopPlayer("E");
                    break;
                case this.hotkeys.moveDown:
                    game.tryToStopPlayer("S");
                    break;
                case this.hotkeys.moveLeft:
                    game.tryToStopPlayer("W");
                    break;
                case this.hotkeys.spellFireball:
                    this.setCursorTo("crosshair", true);
                    this.castingSpell = Spells.Fireball;
                    break;
                case this.hotkeys.swordWindUp:
                    this.setCursorTo("crosshair", true);
                    this.castingSpell = Spells.SwordWindUp;
                    break;
                case this.hotkeys.jump:
                    this.setCursorTo("crosshair", true);
                    this.castingSpell = Spells.Jump;
                    break;
            }
        }
    }

    static cancelSpell() {
        this.castingSpell = -1;
        this.setCursorTo("crosshair", false);
    }

    static resetInput() {
        this.click = null;
        this.rClick = null;

        this.keyDownList = [];
        this.keyUpList = [];
    }

    static setCursorTo(type: string, enabled: boolean) {
        if (enabled) {
            let contained = this.cursors.indexOf(type) > 0;
            if (!contained) {
                this.cursors.push(type);
                Ui.setCursorStyle(type);
            }

            return;
        }

        // remove the given curson
        this.cursors = this.cursors.filter(x => x != type);

        if (this.cursors.length) {
            Ui.setCursorStyle(this.cursors[0]);
        } else {
            Ui.setCursorStyle("default");
        }
    }
}