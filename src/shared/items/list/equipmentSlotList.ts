import ItemTypes from "../enum/itemTypeEnum";

interface EquipmentSlot {
    id: number;
    type: string;
    default: string;
}

export default class EquipmentSlots {

    static get Helmet() { return 1000 }
    static get Amulet() { return 1001 }
    static get Chest() { return 1002 }
    static get Belt() { return 1003 }
    static get Gloves() { return 1004 }

    static get Pants() { return 1005 }
    static get Boots() { return 1006 }
    static get Artefact() { return 1007 }
    static get Ring1() { return 1008 }
    static get Ring2() { return 1009 }

    static get Weapon() { return 1010 }
    static get Offhand() { return 1011 }
    static get Ranged() { return 1012 }

    static list(): Array<EquipmentSlot> {
        return equipmentSlots;
    }

    static getByType(type: string): EquipmentSlot {
        let slot = equipmentSlots.filter(x => x.type == type)[0];
        return slot;
    }

    static getById(id: number): EquipmentSlot {
        let slot = equipmentSlots.filter(x => x.id == id)[0];
        return slot;
    }
}

const equipmentSlots: Array<EquipmentSlot> = [
    { id: EquipmentSlots.Helmet, type: ItemTypes.Helmet, default: null },
    { id: EquipmentSlots.Amulet, type: ItemTypes.Amulet, default: null },
    { id: EquipmentSlots.Chest, type: ItemTypes.Chest, default: "Bare_Chest" },
    { id: EquipmentSlots.Belt, type: ItemTypes.Belt, default: null },
    { id: EquipmentSlots.Gloves, type: ItemTypes.Gloves, default: null },
    { id: EquipmentSlots.Pants, type: ItemTypes.Pants, default: "Bare_Legs" },
    { id: EquipmentSlots.Boots, type: ItemTypes.Boots, default: "Bare_Feet" },
    { id: EquipmentSlots.Artefact, type: ItemTypes.Artefact, default: null },
    { id: EquipmentSlots.Ring1, type: ItemTypes.Ring, default: null },
    { id: EquipmentSlots.Ring2, type: ItemTypes.Ring, default: null },
    { id: EquipmentSlots.Weapon, type: ItemTypes.Weapon, default: null },
    { id: EquipmentSlots.Offhand, type: ItemTypes.Offhand, default: null },
    { id: EquipmentSlots.Ranged, type: ItemTypes.Ranged, default: null }
];