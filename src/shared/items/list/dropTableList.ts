import DropTableItem from "../model/dropTableItem";
import { Dictionary } from "../../helpers/helpers";
import Items from "./itemList";
import EntityTypes from "../../entities/enum/entityTypeEnum";

export default class DropTables {

    static get LeatherBoots() { return 1 }
    static get LeatherTunic() { return 2 }
    static get Glove() { return 3 }
    static get PlateHelmet() { return 4 }
    static get Cloak() { return 5 }
    static get LeatherPants() { return 6 }
    static get Shield() { return 7 }
    static get MerchantPants() { return 17 }
    static get MerchantChest() { return 18 }
    static get Sword() { return 19 }
    static get Bread() { return 20 }
    static get Meat() { return 21 }
    static get Runestone_Blue() { return 22 }


    static for(type: string): Array<DropTableItem> {
        return tableData[type];
    }
}

let tableData: Dictionary<Array<DropTableItem>> = {};

tableData[EntityTypes.Ant] = [
    {
        itemId: Items.Bread,
        dropChance: .3
    },
    {
        itemId: Items.LeatherBoots,
        dropChance: .3
    },
    {
        itemId: Items.Meat,
        dropChance: .3
    },
    {
        itemId: Items.LeatherPants,
        dropChance: .3
    },
    {
        itemId: Items.LeatherTunic,
        dropChance: .3
    },
    {
        itemId: Items.Sword,
        dropChance: .3
    }
];

tableData[EntityTypes.Bugbear] = [
    {
        itemId: 1,
        dropChance: .1
    }
];

tableData[EntityTypes.Grub] = [
    {
        itemId: 1,
        dropChance: .1
    }
];