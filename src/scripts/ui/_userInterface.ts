// import { Login } from "../../react/login";
import { Home } from "../../react/home";
import WordObject from "../typing/wordObject";
import { PlayerHealthBar } from "../../react/playerHealthbar";
import { EnemyHealthBar } from "../../react/enemyHealthBar";
import { ShieldEnergyBar } from "../../react/shieldEnergyBar";
import { GameOver } from "../../react/gameover";
import { GameWon } from "../../react/gameWin";

interface ErrorHandler {
    type: number;
    callback: (string) => void;
}

export default class Ui {
    static errorHandlers: Array<ErrorHandler> = [];
    static mouseMoveHandlers: Array<Function> = [];
    
    static Home: Home;
    static PlayerHealth: PlayerHealthBar;
    static EnemyHealth: EnemyHealthBar;
    static ShieldEnergy: ShieldEnergyBar;
    static GameOver: GameOver;
    static GameWon: GameWon;
    // static Login: Login;

    static initiate() {
        // let inventory = data.inventory.filter(x => x.slotId < 1000);
        // let equipment = data.inventory.filter(x => x.slotId >= 1000);

        // this.Character.init(data.username, data.class);
        // this.Hotbar.init(data.class, data.xp, data.hp, data.maxHp, data.mana, data.maxMana, level);
        // this.Inventory.init(inventory);
        // this.Character.initEquipment(equipment);
        
        // this.Home.hideMenu();
        // this.Home.showInterface();
    }

    static updateWordState(words: Array<WordObject>) {
        this.Home.setWords(words);
    }

    static mouseMove(e) {
        for (let handler of this.mouseMoveHandlers) {
            handler(e);
        }
    }

    static registerMouseMoveHandler(callback: Function) {
        this.mouseMoveHandlers.push(callback)
    }

    static registerErrorHandler(type: number, callback: (string) => void) {
        this.errorHandlers.push({
            type, callback
        })
    }

    static assignErorr(type: number, message: string) {
        let errorHandler = this.errorHandlers.filter(x => x.type == type)[0];
        if (!errorHandler) {
            return console.error("We got an error but don't have a handler for it", type, message);
        }

        errorHandler.callback(message);
    }

    static setCursorStyle(style: string) {
        if ($("body").css("cursor") != style) {
            $("body").css("cursor", style);
        }
    }
}