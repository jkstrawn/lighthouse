import * as React from 'react';
import "../css/inventory.css";
import Items from "../../shared/items/list/itemList";
import Ui from "../scripts/ui/_userInterface";
import ItemSlot from "../../shared/items/model/itemSlot";
import InventorySlot from "../../shared/items/model/inventorySlot";
import Inventory from "../scripts/inventory/_inventory";
import ItemTypes from "../../shared/items/enum/itemTypeEnum";
import Network from "../scripts/core/_networkManager";

class DraggingSlot {
    enabled: boolean;
    x: number;
    y: number;
    itemId: number;
}

interface IInventoryState {
    inventorySlots: Array<InventorySlot>;
    draggingSlot: DraggingSlot;
    money: number;
}

export class InventoryComponent extends React.Component<{}, IInventoryState> {
    holdDelay: boolean;
    lastSlotClicked: number;

    constructor() {
        super();

        this.state = {
            money: 0,
            inventorySlots: [],
            draggingSlot: {
                enabled: false,
                x: 0,
                y: 0,
                itemId: -1
            }
        }

        for (let i = 1; i <= 24; i++) {
            this.state.inventorySlots.push(new InventorySlot(i, ""));
        }

        Ui.Inventory = this;
        Ui.registerMouseMoveHandler((e) => this.mouseMove(e));
    }

    public render() {
        let draggingStyle = this.getStyleForItem(this.state.draggingSlot.itemId);
        draggingStyle["left"] = this.state.draggingSlot.x + "px";
        draggingStyle["top"] = this.state.draggingSlot.y + "px";

        return <div id="inventory" className="ui-element">
            <div id="dragging-slot"
                className={"item-slot slot-with-item-bg" + (this.state.draggingSlot.enabled ? "" : " hidden")}
                style={draggingStyle} />

            <div id="inventory-close" className="close" />
            <div id="inventory-slots">
                {this.state.inventorySlots.map((slot, x) => {
                    let style = this.getStyleForItem(slot.itemId);

                    return <div key={x}
                        className="inventory-slot item-slot"
                        style={style}
                        onMouseDown={(e) => this.slotMouseDown(e, slot)}
                        onMouseUp={(e) => this.slotMouseUp(e, slot)}
                        onContextMenu={(e) => this.slotRightClick(e, slot)}
                        onMouseMove={(e) => this.slotMouseMove(e)}
                        onMouseEnter={(e) => this.slotMouseEnter(e, slot.itemId)}
                        onMouseLeave={(e) => this.slotMouseLeave(e)}>
                        <div className="item-slot-outline" />
                    </div>
                })}
            </div>
            <div id="inventory-money">
                <div id="inventory-money-copper-label"></div>
                <div id="inventory-money-copper-amount">{this.state.money}</div>
            </div>
        </div>;
    }

    init(slots: Array<ItemSlot>) {
        for (let slotData of slots) {
            let slot = this.state.inventorySlots.filter(x => x.id == slotData.slotId)[0];
            slot.itemId = slotData.itemId;
        }

        this.setState({ inventorySlots: this.state.inventorySlots });
    }

    mouseMove(e) {
        if (!this.state.draggingSlot.enabled) {
            return;
        }

        this.state.draggingSlot.x = e.clientX;
        this.state.draggingSlot.y = e.clientY;

        this.setState({ draggingSlot: this.state.draggingSlot });
    }

    updateMoney(money: number) {
        this.setState({ money: money });
    }

    updateSlot(slotData: ItemSlot) {
        let slot = this.state.inventorySlots.filter(x => x.id == slotData.slotId)[0];
        if (!slot) {
            return console.error("Could not get inventory view model slot with id", slotData.slotId);
        }

        slot.itemId = slotData.itemId;

        this.setState({ inventorySlots: this.state.inventorySlots });
    }

    getStyleForItem(itemId: number) {
        if (!itemId || itemId < 1) {
            return {
                backgroundSize: "100%",
                backgroundPosition: "0 0",
                backgroundImage: "url(/css/images/inventory/item_slot_bg.png)"
            };
        }

        let item = Items.get(itemId);
        let x = item.x / 32 * -40;
        let y = item.y / 32 * -40;

        return {
            backgroundPosition: x + "px " + y + "px",
            backgroundImage: "url(/css/images/inventory/icons.jpg)"
        };
    }

    slotMouseUp(e, slot: InventorySlot) {
        if (this.holdDelay || !this.state.draggingSlot.enabled) {
            return;
        }

        if (this.lastSlotClicked == slot.id) {
            let item = Items.get(this.state.draggingSlot.itemId);
            slot.itemId = item.id;
            Inventory.moveItemFeedback(item.material);
        } else {
            let wasMoved = Inventory.moveItemToNewSlot(this.lastSlotClicked, slot.id);
            if (!wasMoved) {
                return;
            }

            slot.itemId = this.state.draggingSlot.itemId;
        }

        this.state.draggingSlot.enabled = false;

        if (slot.id >= 1000) {
            // if the slot is for the equipment, then send the equipment an update
            Ui.Character.updateSlot({ slotId: slot.id, itemId: slot.itemId });
        }

        this.setState({ draggingSlot: this.state.draggingSlot });
    }

    slotMouseDown(e, slot: InventorySlot) {
        e.preventDefault();

        if (e.button == 2) {
            return;
        }

        if (!this.state.draggingSlot.enabled) {
            this.holdDelay = true;
            setTimeout(() => {
                this.holdDelay = false;
            }, 200);
        }

        this.startDraggingFromSlot(slot, e.clientX, e.clientY);
    }

    slotRightClick(e, slot: InventorySlot) {
        e.preventDefault();

        let item = Items.get(slot.itemId);

        if (Ui.NpcVendor.state.open) {
            Network.sellItem({merchantId: Ui.NpcVendor.state.npcId, slotId: slot.id});
            return;
        }

        switch (item.type) {
            case ItemTypes.Consumeable:
                Inventory.useItem(slot.id);
                break;
            case ItemTypes.Trash:
                break;
            default:
                Inventory.equipItem(slot.id);
        }
    }

    slotMouseMove(e) {        
        Ui.ItemToolTip.setPosition(e.clientX, e.clientY);
    }

    slotMouseEnter(e, itemId: number, merchantWare: boolean = false) {
        if (itemId < 0) {
            return;
        }

        let item = Items.get(itemId);

        Ui.ItemToolTip.setItem(item, merchantWare);
    }

    slotMouseLeave(e) {
        Ui.ItemToolTip.hide();
    }

    startDraggingFromSlot(slot: InventorySlot, x, y) {
        if (this.state.draggingSlot.enabled) {
            return;
        }

        if (slot.itemId == -1) {
            return;
        }

        let itemId = slot.itemId;
        this.lastSlotClicked = slot.id;

        slot.itemId = -1;

        if (slot.id >= 1000) {
            // if the slot is for the equipment, then send the equipment an update
            Ui.Character.updateSlot({ slotId: slot.id, itemId: slot.itemId });
        }

        this.setState({
            inventorySlots: this.state.inventorySlots,
            draggingSlot: {
                enabled: true,
                x,
                y,
                itemId
            }
        });

        //$itemToolTip.hide();
    }

    hoverOverInventorySlot(e, id: number) {
        // let itemId = e.target.parentElement.getAttribute("item-id");
        // if (!itemId) {
        //     return;
        // }

        // let isMerchantItem = $(e.target.parentElement).hasClass("npc-vendor-item-icon");
        // let tooltip = $itemToolTip;
        // tooltip.css("top", e.clientY + "px");
        // tooltip.css("left", e.clientX + "px");

        // if (e.type == "mouseenter") {
        //     tooltip.show();
        //     this.setTooltipWithItem(itemId, isMerchantItem);
        // } else {
        //     tooltip.hide();
        // }
    }

    setTooltipWithItem(itemId: number, isMerchantItem: boolean) {
        // let item = Items.get(itemId);
        // let itemTypeUpper = item.type[0].toUpperCase() + item.type.substr(1);
        // let itemName = $("#item-tooltip-name");
        // let itemTypeValue = $("#item-tooltip-type-value");
        // let itemSellPrice = $("#item-tooltip-sell-price");
        // itemSellPrice.hide();

        // this.showItemAttribute(item);
        // this.showItemSellPrice(item, itemSellPrice, isMerchantItem);

        // itemName.html(item.name);
        // itemTypeValue.html(itemTypeUpper);
    }

    // showItemSellPrice(item: Item, itemSellPrice, isMerchantItem: boolean) {
    //     if (!isMerchantItem && this.npc && this.npc.wares) {
    //         let sellPrice = item.defaultSellPrice;

    //         let ware = this.npc.wares.filter(x => x.itemId == item.id)[0];
    //         if (ware) {
    //             sellPrice = ware.merchantBuyPrice;
    //         }

    //         itemSellPrice.show();
    //         let itemSellPriceValue = $("#item-tooltip-sell-price-value");
    //         itemSellPriceValue.html(sellPrice.toString());
    //     }
    // }

    // showItemAttribute(item: Item) {
    //     switch (item.type) {
    //         case ItemTypes.Consumeable:
    //             return this.showItemAttributeWithValue("Health", item.healthRestore.toString());
    //         case ItemTypes.Weapon:
    //             return this.showItemAttributeWithValue("Damage", item.damage.toString());
    //         case ItemTypes.Trash:
    //             return this.showItemAttributeWithValue("", "");
    //         default:
    //             return this.showItemAttributeWithValue("Protection", item.protection.toString());
    //     }
    // }

    // showItemAttributeWithValue(valueName: string, value: string) {
    //     let itemStatLabel = $("#item-tooltip-stat-label");
    //     let itemStatValue = $("#item-tooltip-stat-value");

    //     itemStatLabel.html(valueName);
    //     itemStatValue.html(value);
    // }
}
