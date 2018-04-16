import * as React from 'react';
import game from '../scripts/core/gameEngine';
import * as $ from 'jquery';
import * as THREE from "three";
import Ui from "../scripts/ui/_userInterface";
import Input from "../scripts/ui/_input";
import { WordComponent } from './wordComponent';
import WordObject from '../scripts/typing/wordObject';
import "../css/site.css";
import "../css/login.css";
import { PlayerHealthBar } from './playerHealthbar';
import { EnemyHealthBar } from './enemyHealthBar';
import { ShieldEnergyBar } from './shieldEnergyBar';
import { GameOver } from './gameover';
import { GameWon } from './gameWin';

window["adminMap"] = null;
window["game"] = game;

interface IHomeState {
    words: Array<WordObject>;
}

export class Home extends React.Component<{}, IHomeState> {
    constructor(props) {
        super(props);

        Ui.Home = this;

        this.state = { words: [] };
    }

    public render() {
        return <div>

            <div id="canvasContainer"
                onClick={(e) => this.click(e)}>
            </div>

            {this.state.words.map(x =>
                <WordComponent key={x.id} wordObject={x} />
            )}

            <EnemyHealthBar/>
            <PlayerHealthBar/>
            <ShieldEnergyBar/>
            <GameOver/>
            <GameWon/>

            <div className="pause-button button" onClick={() => this.pause()}>Pause</div>
            {/* <div id="interface" className={this.state.interfaceHidden ? "hidden" : ""}>

            </div>

            <div id="menu" className={this.state.menuHidden ? "hidden" : ""}>
                <Login />
            </div> */}
        </div>;
    }

    componentWillMount() {
        document.addEventListener("keypress", this.keyPress, false);
    }

    setWords(words: Array<WordObject>) {
        this.setState({ words });
    }

    click(e: React.MouseEvent<HTMLDivElement>) {
        Input.onLeftClick(e);
    }

    keyPress(e: KeyboardEvent) {
        Input.onKeyPress(e.key);
    }

    pause() {
        game.paused = !game.paused;
    }

    // hideMenu() {
    //     this.setState({ menuHidden: true });
    // }

    // showInterface() {
    //     this.setState({ interfaceHidden: false });
    // }

    componentDidMount() {

        let animate = function () {
            requestAnimationFrame(animate);

            let dt = clock.getDelta() * 1000;

            game.update(dt);
            game.render(dt);
        }

        window["animate"] = animate;

        let clock = new THREE.Clock(true);

        window["clock"]

        game.init();
    }
}
