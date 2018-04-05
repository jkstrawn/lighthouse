import ItemSlot from "../../items/model/itemSlot";
import PlayerAttribute from "./playerAttribute";

export default class PlayerDatabaseModel {
    id?: number;
    x?: number;
    y?: number;
    z?: number;
    type?: string;
    dead?: boolean;
    
    // health component
    hp?: number;
    baseHp?: number;
    
    // inventory component
    inventory?: Array<ItemSlot>;

    // mana component
    mana?: number;
    maxMana?: number;

    // player component
    username?: string;
    xp?: number;
    money?: number;
    attributes?: Array<PlayerAttribute>;
    pointsToSpend?: number; 
    class?: number;
}