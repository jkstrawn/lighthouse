import * as React from 'react';
import game from '../scripts/core/gameEngine';
import * as $ from 'jquery';
import * as THREE from "three";
import Ui from "../scripts/ui/_userInterface";
import Input from "../scripts/ui/_input";
import { Chat } from "./chat";
import { Hotbar } from "./hotbar";
import { Character } from "./character";
import { LootBag } from "./lootBag";
import { ItemToolTip } from "./itemToolTip";
import { NpcVendor } from "./npcVendor";
import { Login } from "./login";
import { CharacterCreate } from "./characterCreate";
import { InventoryComponent } from "./inventoryComponent";
import { SyntheticEvent } from "react";
import "../css/site.css";
import "../css/login.css";

window["adminMap"] = null;
window["game"] = game;

function getIt(gearDamage, strength, level) {

    let baseDamage = (level + 2) / 3;
    let strengthFactor = (strength + 4) / 5;

    let weaponDamage = gearDamage * strengthFactor;
    let handDamage = baseDamage * strengthFactor;

    return Math.max(1, handDamage + weaponDamage);
}

function test() {
    console.log("level 1 unnarmed (1 str)", getIt(0, 1, 1));
    console.log("level 1 with club (1 str)", getIt(1, 1, 1));
    console.log("level 1 unnarmed (6 str)", getIt(0, 6, 1));
    console.log("level 1 with club (6 str)", getIt(1, 6, 1));

    console.log("level 6 unnarmed (1 str)", getIt(0, 1, 6));

    console.log("level 6 unnarmed (6 str)", getIt(0, 6, 6));
    console.log("level 6 with club (6 str)", getIt(1, 6, 6));
    console.log("level 6 with sword (6 str)", getIt(2, 6, 6));
    console.log("level 6 with sword (13 str)", getIt(2, 13, 6));
}


window["test"] = test;

interface IHomeState {
    menuHidden?: boolean;
    interfaceHidden?: boolean;
}

export class Home extends React.Component<{}, IHomeState> {
    constructor() {
        super();

        Ui.Home = this;

        this.state = { menuHidden: false, interfaceHidden: true };
    }

    public render() {
        return <div
            onMouseMove={(e) => this.mouseMove(e)}>

            <div id="canvasContainer"
                onClick={(e) => this.click(e)}
                onContextMenu={(e) => this.canvasRightClick(e)}
                onMouseDown={(e) => this.mouseDown(e)}
                onMouseUp={(e) => this.mouseUp(e)}>
            </div>

            <div id="interface" className={this.state.interfaceHidden ? "hidden" : ""}>
                <Chat />
                <Hotbar />
                <InventoryComponent />
                <NpcVendor />
                <ItemToolTip />
                <LootBag />
                <Character />
            </div>

            <div id="menu" className={this.state.menuHidden ? "hidden" : ""}>
                <Login />
                <CharacterCreate />
            </div>

            <div className="context-menu">
                <ul>
                    <li data-command="spawn|bugbear">Spawn Bugbear</li>
                    <li data-command="spawn|ant">Spawn Ant</li>
                    <li data-command="spawn|grub">Spawn Grub</li>
                </ul>
            </div>

        </div>;
    }

    componentWillMount() {
        document.addEventListener("keydown", this.keyDown, false);
        document.addEventListener("keyup", this.keyUp, false);
        document.addEventListener("contextmenu", this.rightClick, false);
    }

    mouseMove(e: React.MouseEvent<HTMLDivElement>) {
        Input.mouseMove(e);

        Ui.mouseMove(e);
    }

    click(e: React.MouseEvent<HTMLDivElement>) {
        Input.onLeftClick(e);
    }

    canvasRightClick(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();
    }

    mouseDown(e: React.MouseEvent<HTMLDivElement>) {
        if (e.button == 2) {
            Input.onRightMouseDown(e);
        }
    }

    mouseUp(e: React.MouseEvent<HTMLDivElement>) {
        if (e.button == 2) {
            Input.onRightMouseUp(e);
        }
    }

    rightClick(e) {
        e.preventDefault();
    }

    keyDown(e: KeyboardEvent) {
        if (e.target["type"] == "text") {
            return;
        }

        Input.onKeyDown(e.keyCode);
    }

    keyUp(e: KeyboardEvent) {
        if (e.target["type"] == "text") {
            return;
        }

        Input.onKeyUp(e.keyCode);
    }

    hideMenu() {
        this.setState({ menuHidden: true });
    }

    showInterface() {
        this.setState({ interfaceHidden: false });
    }

    componentDidMount() {

        let animate = function () {
            requestAnimationFrame(animate);

            let dt = clock.getDelta() * 1000;

            game.render(dt);
            game.update(dt);
        }

        window["animate"] = animate;

        let clock = new THREE.Clock(true);

        game.init();
    }
}
