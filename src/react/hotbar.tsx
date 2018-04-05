import * as React from 'react';
import "../css/hotbar.css";
import Ui from "../scripts/ui/_userInterface";
import XpManager from "../../shared/entities/xpManager";
import Classes from "../../shared/entities/list/classList";

interface IHotbarState {
    class: string;
    hp: number;
    maxHp: number;
    mana: number;
    maxMana: number;
    xpPercent: number;
    level: number;
}

export class Hotbar extends React.Component<{}, IHotbarState> {
    constructor() {
        super();

        this.state = {
            class: "",
            hp: 1,
            maxHp: 1,
            mana: 1,
            maxMana: 1,
            xpPercent: 0,
            level: 1
        }

        Ui.Hotbar = this;
    }

    public render() {
        // mana bar degree goes between -86 and 86, for a total of 172 degrees
        let manaDegree = this.state.mana / this.state.maxMana * 172 + -86;
        let hpPercent = (this.state.hp / this.state.maxHp * 100) + "%";
        let xpPercent = this.state.xpPercent + "%";

        let hpBarStyle = {height: hpPercent};
        let manaBarStyle = {transform: `rotate(${manaDegree}deg)`};
        let xpBarStyle = {width: xpPercent};

        return <div id="hotbar">
            <div id="health-orb">
                <div id="health-orb-filling" style={hpBarStyle}>
                    <div id="health-orb-filling-background"></div>
                </div>
                <div id="health-orb-foreground"></div>
            </div>

            <div id="mana-bar">
                <div id="mana-bar-filling" style={manaBarStyle}></div>
            </div>

            <div id="xp-bar">
                <div id="xp-bar-filling" style={xpBarStyle}></div>
            </div>

            <div id="menu-character-label">Level {this.state.level} {this.state.class}</div>

            <div id="hotbar-menu">
                <div id="menu-character" className="menu-item" onClick={() => Ui.Character.toggle()}></div>
                <div id="menu-inventory" className="menu-item"></div>
                <div id="menu-abilities" className="menu-item"></div>
            </div>
        </div>;
    }

    init(_class: number, xp: number, hp: number, maxHp: number, mana: number, maxMana: number, level: number) {
        let xpPercent = this.getXpPercent(level, xp);
        let className = Classes.getById(_class).name;

        this.setState({class: className, xpPercent, hp, maxHp, mana, maxMana, level});
    }

    setHealth(hp: number, maxHp: number) {
        this.setState({hp, maxHp});
    }

    setMana(mana: number, maxMana: number) {
        this.setState({mana, maxMana});
    }

    getXpPercent(level: number, xp: number): number {
        let xpToLastLevel = XpManager.xpFor(level);
        let xpToLevel = XpManager.xpFor(level + 1);
        
        let currentXp = xp - xpToLastLevel;
        let maxXp = xpToLevel - xpToLastLevel;

        return currentXp / maxXp * 100;
    }

    updateXp(level: number, xp: number) {
        let xpPercent = this.getXpPercent(level, xp);

        this.setState({xpPercent, level});
    }
}
