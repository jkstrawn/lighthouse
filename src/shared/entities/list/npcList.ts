import Npc from "../model/npc";
import Items from "../../items/list/itemList";

export default class Npcs {

    static get VincentTrentwood() { return 1 }

    static get(id: number): Npc {
        return npcs.filter(x => x.id == id)[0];
    }
}

let npcs: Array<Npc> = [
    {
        id: Npcs.VincentTrentwood,
        name: "Vincent Trentwood",
        wares: [
            {
                itemId: Items.Sword,
                merchantBuyPrice: 3,
                merchantSellPrice: 5
            },
            {
                itemId: Items.LeatherTunic,
                merchantBuyPrice: 7,
                merchantSellPrice: 10
            },
            {
                itemId: Items.LeatherBoots,
                merchantBuyPrice: 3,
                merchantSellPrice: 4
            },
            {
                itemId: Items.LeatherPants,
                merchantBuyPrice: 5,
                merchantSellPrice: 7
            },
        ]
    },
];