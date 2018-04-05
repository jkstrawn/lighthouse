import ServerErrors from "../../../shared/network/serverErrorEnum";
import ItemSlot from "../../../shared/items/model/itemSlot";
import PlayerAttribute from "../../../shared/entities/model/playerAttribute";
import { Login } from "../../react/login";
import { Character } from "../../react/character";
import { InventoryComponent } from "../../react/inventoryComponent";
import { CharacterCreate } from "../../react/characterCreate";
import { Home } from "../../react/home";
import EntityDataModel from "../../../shared/network/fromServer/entityDataModel";
import { Hotbar } from "../../react/hotbar";
import XpManager from "../../../shared/entities/xpManager";
import { Chat } from "../../react/chat";
import { LootBag } from "../../react/lootBag";
import { NpcVendor } from "../../react/npcVendor";
import { ItemToolTip } from "../../react/itemToolTip";

interface ErrorHandler {
    type: number;
    callback: (string) => void;
}

export default class Ui {
    static errorHandlers: Array<ErrorHandler> = [];
    static mouseMoveHandlers: Array<Function> = [];

    static Home: Home;
    static Character: Character;
    static Inventory: InventoryComponent;
    static Login: Login;
    static ItemToolTip: ItemToolTip;
    static CharacterCreate: CharacterCreate;
    static Hotbar: Hotbar;
    static Chat: Chat;
    static NpcVendor: NpcVendor;
    static LootBag: LootBag;

    static initiate(data: EntityDataModel) {
        let level = XpManager.getLevelFromXp(data.xp);
        let inventory = data.inventory.filter(x => x.slotId < 1000);
        let equipment = data.inventory.filter(x => x.slotId >= 1000);

        this.Character.init(data.username, data.class);
        this.Hotbar.init(data.class, data.xp, data.hp, data.maxHp, data.mana, data.maxMana, level);
        this.Inventory.init(inventory);
        this.Character.initEquipment(equipment);
        
        this.Home.hideMenu();
        this.Home.showInterface();
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
    
    static updateXp(level: number, xp: number) {
        this.Hotbar.updateXp(level, xp);
        this.Character.setLevel(level);
    }

    static updateInventorySlot(slotData: ItemSlot) {
        if (slotData.slotId < 1000) {
            this.Inventory.updateSlot(slotData);
        } else {
            this.Character.updateSlot(slotData);
        }
    }

    static setCursorStyle(style: string) {
        if ($("body").css("cursor") != style) {
            $("body").css("cursor", style);
        }
    }
}