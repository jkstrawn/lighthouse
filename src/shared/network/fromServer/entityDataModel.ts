import ItemSlot from "../../items/model/itemSlot";
import PlayerAttribute from "../../entities/model/playerAttribute";

export default interface EntityDataModel {
    id?: number;
    x?: number;
    y?: number;
    z?: number;
    type?: string;
    dead?: boolean;

    // collide component
    hitboxSize?: number;

    // combat component
    attacking?: boolean;
    attackAngle?: number;
    blocking?: boolean;
    
    blockedHit?: boolean;
    attacked?: boolean;

    // health component
    hp?: number;
    maxHp?: number;
    alive?: boolean;
    baseHp?: number;                        //database
    
    damaged?: number;
    wasAttacked?: boolean;
    healed?: number;

    // inventory component
    equipment?: Array<ItemSlot>;
    inventory?: Array<ItemSlot>;            //private
    gearProtection?: number;                //private
    gearAttackDamage?: number;              //private

    //lootable component
    items?: Array<number>;

    // mana component
    mana?: number;
    maxMana?: number;

    // move component
    rotation?: number;
    moved?: boolean;

    // npc component
    npcId?: number;

    // player component
    username?: string;
    xp?: number;                            //private
    money?: number;                         //private
    attributes?: Array<PlayerAttribute>;    //private
    pointsToSpend?: number;                 //private 
    class?: number;                         //private
}