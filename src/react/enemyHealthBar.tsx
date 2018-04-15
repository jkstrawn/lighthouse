import * as React from 'react';
import Ui from '../scripts/ui/_userInterface';

interface IEnemyHealthState {
    health: number;
    maxHealth: number;
}

export class EnemyHealthBar extends React.Component<{}, IEnemyHealthState> {
    constructor(props) {
        super(props);

        Ui.EnemyHealth = this;

        this.state = {maxHealth: 100, health: 100};
    }

    render() {
        let hpPercent = (this.state.health / this.state.maxHealth * 100) + "%";
        let xpBarStyle = {width: hpPercent};

        return <div className="enemy-health-bar health-bar">
            <div className="health-bar-filling" style={xpBarStyle}></div>
        </div>
    }

    updateHealth(maxHealth: number, health: number) {
        this.setState({maxHealth, health});
    }
}