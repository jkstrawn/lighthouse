import * as React from 'react';
import "../css/login.css";
import Ui from "../scripts/ui/_userInterface";
import game from '../scripts/core/gameEngine';

interface IGameWonState {
    hidden?: boolean;
}

export class GameWon extends React.Component<{}, IGameWonState> {
    constructor(props) {
        super(props);

        Ui.GameWon = this;

        this.state = { hidden: true };
    }

    public render() {
        return <div className={"you-lose " + (this.state.hidden ? "hidden" : "")}>
            <h2>You Won!! #Winning</h2>
            <div className="restart-game-button button" onClick={() => this.restartGame()}>Restart Game</div>
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
