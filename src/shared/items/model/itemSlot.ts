export default class ItemSlot {
    itemId: number;
    slotId: number;

    constructor(slotId: number, itemId: number) {
        this.slotId = slotId;
        this.itemId = itemId;
    }
}