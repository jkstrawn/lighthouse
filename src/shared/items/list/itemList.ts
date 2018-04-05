import Item from "../model/item";
import ItemTypes from "../enum/itemTypeEnum";
import ItemMaterials from "../enum/itemMaterialEnum";

export default class Items {

    static get LeatherBoots() { return 1 }
    static get LeatherTunic() { return 2 }
    static get PlateHelmet() { return 3 }
    static get LeatherPants() { return 4 }
    static get Shield() { return 5 }
    static get Sword() { return 6 }
    static get Bread() { return 7 }
    static get Meat() { return 8 }
    static get Runestone_Blue() { return 9 }

    static get MerchantPants() { return 17 }
    static get MerchantChest() { return 18 }

    // static get Glove() { return 0 }
    // static get Cloak() { return 0 }
    // static get Axe() { return 0 }
    // static get Sicle() { return 0 }
    // static get Staff() { return 0 }
    // static get Bag1() { return 0 }
    // static get Bag2() { return 0 }
    // static get Bag3() { return 0 }
    // static get Bar_Copper() { return 0 }
    // static get Bar_Gold() { return 0 }
    // static get Bar_Silver() { return 0 }
    // static get Book() { return 0 }
    // static get Bow() { return 0 }
    // static get Bracer() { return 0 }
    // static get Gemstone_Blue() { return 0 }
    // static get Gemstone_Green() { return 0 }
    // static get Gemstone_Yellow() { return 0 }
    // static get Herb1() { return 0 }
    // static get Herbbag1() { return 0 }
    // static get Herbbag2() { return 0 }
    // static get Herbbag3() { return 0 }
    // static get Key_Gold() { return 0 }
    // static get Key_Silver() { return 0 }
    // static get Lantern() { return 0 }
    // static get Letter() { return 0 }
    // static get Necklace_Blue() { return 0 }
    // static get Necklace_Green() { return 0 }
    // static get Necklace_Purple() { return 0 }
    // static get Necklace_Red() { return 0 }
    // static get Necklace_Yellow() { return 0 }
    // static get Ore_Blue() { return 0 }
    // static get Ore_Copper() { return 0 }
    // static get Ore_Gold() { return 0 }
    // static get Ore_Green() { return 0 }
    // static get Ore_Purple() { return 0 }
    // static get Ore_Red() { return 0 }
    // static get Ore_Silver() { return 0 }
    // static get Ore_Yellow() { return 0 }
    // static get Pickaxe() { return 0 }
    // static get Potion_Blue() { return 0 }
    // static get Potion_Green() { return 0 }
    // static get Potion_Purple() { return 0 }
    // static get Potion_Red() { return 0 }
    // static get Potion_Yellow() { return 0 }
    // static get Ring_Blue() { return 0 }
    // static get Ring_Green() { return 0 }
    // static get Ring_Purple() { return 0 }
    // static get Ring_Red() { return 0 }
    // static get Ring_Yellow() { return 0 }
    // static get Runestone_Green() { return 0 }
    // static get Runestone_Purple() { return 0 }
    // static get Runestone_Red() { return 0 }
    // static get Runestone_Yellow() { return 0 }
    // static get Scroll() { return 0 }

    static get(id: number): Item {
        return items.filter(x => x.id == id)[0];
    }
}

let items: Array<Item> = [
    {
        id: Items.LeatherBoots,
        modelName: "Leather_Boots",
        name: "Leather Boots",
        defaultSellPrice: 2,
        protection: 1,
        x: 0,
        y: 96,
        type: ItemTypes.Boots,
        material: ItemMaterials.Leather,
    },
    {
        id: Items.LeatherTunic,
        modelName: "Leather_Chest",
        name: "Crude Leather Tunic",
        defaultSellPrice: 4,
        protection: 1,
        x: 0,
        y: 0,
        type: ItemTypes.Chest,
        material: ItemMaterials.Leather
    },
    {
        id: Items.PlateHelmet,
        modelName: "Plate_Helmet",
        name: "Plate Helmet",
        defaultSellPrice: 6,
        protection: 1,
        x: 160,
        y: 32,
        type: ItemTypes.Helmet,
        material: ItemMaterials.Metal
    },
    {
        id: Items.LeatherPants,
        modelName: "Leather_Pants",
        name: "Crude Leather Pants",
        defaultSellPrice: 3,
        protection: 1,
        x: 64,
        y: 192,
        type: ItemTypes.Pants,
        material: ItemMaterials.Leather
    },
    {
        id: Items.Shield,
        modelName: "Shield",
        name: "Battered Shield",
        defaultSellPrice: 2,
        protection: 1,
        x: 224,
        y: 192,
        type: ItemTypes.Offhand,
        material: ItemMaterials.Wood
    },
    {
        id: Items.Sword,
        modelName: "Sword",
        name: "Rusty Sword",
        defaultSellPrice: 2,
        damage: 2,
        x: 256,
        y: 0,
        type: ItemTypes.Weapon,
        material: ItemMaterials.Metal
    },
    {
        id: Items.MerchantPants,
        modelName: "Merchant_Legs",
        name: "Merchant Leggings",
        defaultSellPrice: 1,
        protection: 0,
        x: 128,
        y: 0,
        type: ItemTypes.Chest,
        material: ItemMaterials.Cloth
    },
    {
        id: Items.MerchantChest,
        modelName: "Merchant_Chest",
        name: "Merchant Tunic",
        defaultSellPrice: 1,
        protection: 0,
        x: 160,
        y: 0,
        type: ItemTypes.Pants,
        material: ItemMaterials.Cloth
    },
    {
        id: Items.Bread,
        modelName: "",
        name: "Stale Bread",
        defaultSellPrice: 1,
        healthRestore: 3,
        x: 32,
        y: 96,
        type: ItemTypes.Consumeable,
        material: ItemMaterials.Food
    },
    {
        id: Items.Meat,
        modelName: "",
        name: "Meat Shank",
        defaultSellPrice: 2,
        healthRestore: 5,
        x: 192,
        y: 96,
        type: ItemTypes.Consumeable,
        material: ItemMaterials.Food
    },
    {
        id: Items.Runestone_Blue,
        modelName: "",
        name: "Ancient Runestone",
        defaultSellPrice: 1,
        x: 160,
        y: 192,
        type: ItemTypes.Trash,
        material: ItemMaterials.Stone
    }

    // { id: Items.Glove, name: "Glove", x: 192, y: 0, type: "gloves" },
    // { id: Items.Cloak, name: "Cloak", x: 64, y: 96 },
    // { id: Items.Axe, name: "Axe", x: 32, y: 0 },
    // { id: Items.Sicle, name: "Sicle", x: 192, y: 224 },
    // { id: Items.Staff, name: "Staff", x: 224, y: 224 },
    // { id: Items.Meat, name: "Meat", x: 192, y: 96 },
    // { id: Items.Bag1, name: "Bag1", x: 0, y: 32 },
    // { id: Items.Bag2, name: "Bag2", x: 32, y: 32 },
    // { id: Items.Bag3, name: "Bag3", x: 64, y: 0 },
    // { id: Items.Bar_Copper, name: "Bar_Copper", x: 64, y: 32 },
    // { id: Items.Bar_Gold, name: "Bar_Gold", x: 96, y: 0 },
    // { id: Items.Bar_Silver, name: "Bar_Silver", x: 96, y: 32 },
    // { id: Items.Book, name: "Book", x: 0, y: 64 },
    // { id: Items.Bow, name: "Bow", x: 32, y: 64 },
    // { id: Items.Bracer, name: "Bracer", x: 64, y: 64 },
    // { id: Items.Gemstone_Blue, name: "Gemstone_Blue", x: 96, y: 64 },
    // { id: Items.Gemstone_Green, name: "Gemstone_Green", x: 96, y: 96 },
    // { id: Items.Gemstone_Yellow, name: "Gemstone_Yellow", x: 128, y: 32 },
    // { id: Items.Herb1, name: "Herb1", x: 128, y: 64 },
    // { id: Items.Herbbag1, name: "Herbbag1", x: 160, y: 64 },
    // { id: Items.Herbbag2, name: "Herbbag2", x: 128, y: 96 },
    // { id: Items.Herbbag3, name: "Herbbag3", x: 192, y: 32 },
    // { id: Items.Key_Gold, name: "Key_Gold", x: 224, y: 0 },
    // { id: Items.Key_Silver, name: "Key_Silver", x: 224, y: 32 },
    // { id: Items.Lantern, name: "Lantern", x: 192, y: 64 },
    // { id: Items.Letter, name: "Letter", x: 160, y: 96 },
    // { id: Items.Necklace_Blue, name: "Necklace_Blue", x: 224, y: 64 },
    // { id: Items.Necklace_Green, name: "Necklace_Green", x: 224, y: 96 },
    // { id: Items.Necklace_Purple, name: "Necklace_Purple", x: 0, y: 128 },
    // { id: Items.Necklace_Red, name: "Necklace_Red", x: 32, y: 128 },
    // { id: Items.Necklace_Yellow, name: "Necklace_Yellow", x: 0, y: 160 },
    // { id: Items.Ore_Blue, name: "Ore_Blue", x: 32, y: 160 },
    // { id: Items.Ore_Copper, name: "Ore_Copper", x: 0, y: 192 },
    // { id: Items.Ore_Gold, name: "Ore_Gold", x: 64, y: 128 },
    // { id: Items.Ore_Green, name: "Ore_Green", x: 32, y: 192 },
    // { id: Items.Ore_Purple, name: "Ore_Purple", x: 0, y: 224 },
    // { id: Items.Ore_Red, name: "Ore_Red", x: 64, y: 160 },
    // { id: Items.Ore_Silver, name: "Ore_Silver", x: 96, y: 128 },
    // { id: Items.Ore_Yellow, name: "Ore_Yellow", x: 128, y: 128 },
    // { id: Items.Pickaxe, name: "Pickaxe", x: 32, y: 224 },
    // { id: Items.Potion_Blue, name: "Potion_Blue", x: 96, y: 160 },
    // { id: Items.Potion_Green, name: "Potion_Green", x: 64, y: 224 },
    // { id: Items.Potion_Purple, name: "Potion_Purple", x: 128, y: 160 },
    // { id: Items.Potion_Red, name: "Potion_Red", x: 96, y: 192 },
    // { id: Items.Potion_Yellow, name: "Potion_Yellow", x: 160, y: 128 },
    // { id: Items.Ring_Blue, name: "Ring_Blue", x: 128, y: 192 },
    // { id: Items.Ring_Green, name: "Ring_Green", x: 96, y: 224 },
    // { id: Items.Ring_Purple, name: "Ring_Purple", x: 192, y: 128 },
    // { id: Items.Ring_Red, name: "Ring_Red", x: 160, y: 160 },
    // { id: Items.Ring_Yellow, name: "Ring_Yellow", x: 192, y: 160 },
    // { id: Items.Runestone_Green, name: "Runestone_Green", x: 128, y: 224 },
    // { id: Items.Runestone_Purple, name: "Runestone_Purple", x: 224, y: 128 },
    // { id: Items.Runestone_Red, name: "Runestone_Red", x: 160, y: 224 },
    // { id: Items.Runestone_Yellow, name: "Runestone_Yellow", x: 224, y: 160 },
    // { id: Items.Scroll, name: "Scroll", x: 192, y: 192 }
];