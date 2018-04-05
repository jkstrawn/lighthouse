export default class InventorySlot {
    id: number;
    type: string;
    itemId: number;

    constructor(id: number, type: string) {
        this.id = id;
        this.type = type;
        this.itemId = -1;
    }
}