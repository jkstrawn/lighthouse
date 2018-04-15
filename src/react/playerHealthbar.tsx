import * as React from 'react';
import Ui from '../scripts/ui/_userInterface';

interface IPlayerHealthState {
    health: number;
    maxHealth: number;
}

export class PlayerHealthBar extends React.Component<{}, IPlayerHealthState> {
    constructor(props) {
        super(props);

        Ui.PlayerHealth = this;

        this.state = {maxHealth: 100, health: 100};
    }

    render() {
        let hpPercent = (this.state.health / this.state.maxHealth * 100) + "%";
        let xpBarStyle = {width: hpPercent};

        return <div className="player-health-bar health-bar">
            <div className="health-bar-filling" style={xpBarStyle}></div>
        </div>
    }

    updateHealth(maxHealth: number, health: number) {
        this.setState({maxHealth, health});
    }
}