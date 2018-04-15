import * as React from 'react';
import "../css/login.css";
import Ui from "../scripts/ui/_userInterface";
import game from '../scripts/core/gameEngine';

interface IGameOverState {
    hidden?: boolean;
}

export class GameOver extends React.Component<{}, IGameOverState> {
    constructor() {
        super(null);

        Ui.GameOver = this;

        this.state = { hidden: true };
    }

    public render() {
        return <div className={"you-lose " + (this.state.hidden ? "hidden" : "")}>
            <h2>You Lose</h2>
            <input className="restart-game-button" value="Restart Game" onClick={() => this.restartGame()} />
        </div>;
    }

    show() {
        this.setState({ hidden: false });
    }

    private restartGame() {
        this.setState({ hidden: true });
        game.restart();
    }
}
