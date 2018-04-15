import * as React from 'react';
import Ui from '../scripts/ui/_userInterface';

interface IShieldState {
    leftShield: number;
    rightShield: number;
}

export class ShieldEnergyBar extends React.Component<{}, IShieldState> {
    constructor(props) {
        super(props);

        Ui.ShieldEnergy = this;

        this.state = {leftShield: 0, rightShield: 0};
    }

    render() {
        let leftShieldStyle = {width: this.state.leftShield + "%"};
        let rightShieldStyle = {width: this.state.rightShield + "%"};

        return <div>
            <div className="left-energy-bar health-bar">
                <div className="energy-bar-filling" style={leftShieldStyle}></div>
            </div>

            <div className="right-energy-bar health-bar">
                <div className="energy-bar-filling" style={rightShieldStyle}></div>
            </div>
        </div>
    }

    updateEnergy(leftEnergy: number, rightEnergy: number) {
        this.setState({leftShield: leftEnergy, rightShield: rightEnergy});
    }
}