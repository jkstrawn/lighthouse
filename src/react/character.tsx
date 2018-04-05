import * as React from 'react';
import "../css/character.css";
import Ui from "../scripts/ui/_userInterface";
import PlayerAttribute from "../../shared/entities/model/playerAttribute";
import Attributes from "../../shared/entities/list/attributeList";
import Classes from "../../shared/entities/list/classList";
import Network from "../scripts/core/_networkManager";
import EquipmentSlots from "../../shared/items/list/equipmentSlotList";
import InventorySlot from "../../shared/items/model/inventorySlot";
import ItemSlot from "../../shared/items/model/itemSlot";
import Inventory from "../scripts/inventory/_inventory";
import { StringHelper } from "../../shared/helpers/helpers";

interface ICharacterState {
    characterHidden?: boolean;
    attributes: Array<PlayerAttribute>;
    level: number;
    username: string;
    class: string;
    maxHealth: number;
    maxMana: number;
    pointsToSpend: number;
    tab: number;
    protection: number;
    damage: number;
    equipmentSlots: Array<InventorySlot>;
}

export class Character extends React.Component<{}, ICharacterState> {
    constructor() {
        super();

        let equipment = EquipmentSlots.list().map((slot): InventorySlot => {
            return new InventorySlot(slot.id, slot.type);
        });

        this.state = {
            characterHidden: true,
            attributes: [
                { type: 1, value: 1 },
                { type: 2, value: 1 },
                { type: 3, value: 1 },
                { type: 4, value: 1 },
                { type: 5, value: 1 },
                { type: 6, value: 1 },
            ],
            username: "Player",
            level: 1,
            class: "",
            maxHealth: 1,
            maxMana: 1,
            pointsToSpend: 0,
            tab: 2,
            damage: 0,
            protection: 0,
            equipmentSlots: equipment
        };

        Ui.Character = this;
    }

    public render() {
        let equipment = this.state.equipmentSlots.map((slot, x) => {
            let style = this.getStyleForItem(slot);

            return <div key={x}
                className="inventory-slot item-slot character-slot"
                style={style}
                onMouseDown={(e) => Ui.Inventory.slotMouseDown(e, slot)}
                onMouseUp={(e) => Ui.Inventory.slotMouseUp(e, slot)}
                onContextMenu={(e) => this.slotRightClick(e, slot)}>
                <div className="item-slot-outline"></div>
            </div>
        });

        return <div id="character" className={this.state.characterHidden ? "hidden" : ""}>
            <div id="character-header">
                <div id="character-name">{StringHelper.capitalize(this.state.username)}</div>
                <div id="character-level">Level {this.state.level} {this.state.class}</div>
            </div>
            <div id="character-divider"></div>

            <div id="character-window-stats" className={this.state.tab != 2 ? "hidden" : ""}>
                <div id="character-stats-header">
                    Attributes
                </div>

                <div id="character-stats-health-mana">
                    <div id="character-stats-health">
                        Health
                        <div id="character-stats-health-value">{this.state.maxHealth}</div>
                    </div>
                    <div id="character-stats-mana">
                        Mana
                        <div id="character-stats-mana-value">{this.state.maxMana}</div>
                    </div>
                </div>

                <div id="character-stats-attributes">
                    {this.state.attributes.map((attr, x) => {
                        let attrData = Attributes.getById(attr.type);

                        return <div className="character-create-attribute attribute" key={x}>
                            {attrData.name}
                            <div className="attribute-value">{attr.value}</div>
                        </div>
                    })}
                </div>

                <div id="character-stats-attributes-pluses" className={this.state.pointsToSpend == 0 ? "hidden" : ""}>
                    {this.state.attributes.map((attr, x) =>
                        <div key={x}
                            className="character-create-attribute-plus attribute-plus"
                            onClick={() => this.addAttribute(attr)} />
                    )}
                </div>
            </div>

            <div id="character-window-equipment" className={this.state.tab != 1 ? "hidden" : ""}>
                <div id="slots-left">
                    {equipment.slice(0, 5)}
                </div>

                <div id="slots-right">
                    {equipment.slice(5, 10)}
                </div>

                <div id="weapons">
                    {equipment.slice(10, 13)}
                </div>

                <div id="equipment-damage-protection">
                    <div id="equipment-damage">
                        Damage
                        <div id="equipment-damage-value">{this.state.damage}</div>
                    </div>
                    <div id="equipment-protection">
                        Protection
                        <div id="equipment-protection-value">{this.state.protection}</div>
                    </div>
                </div>
            </div>
            <div id="character-close" className="close" onClick={() => this.toggle()}></div>
            <div id="character-tabs">
                <div className={"character-tab" + (this.state.tab == 1 ? " selected" : "")}
                    onClick={() => this.switchTab(1)}>Equipment</div>
                <div className={"character-tab" + (this.state.tab == 2 ? " selected" : "")}
                    onClick={() => this.switchTab(2)}>Character</div>
            </div>
        </div >;
    }

    init(username: string, _class: number) {
        let className = Classes.getById(_class).name

        this.setState({ username, class: className });
    }

    initEquipment(slots: Array<ItemSlot>) {
        for (let slotData of slots) {
            let slot = this.state.equipmentSlots.filter(x => x.id == slotData.slotId)[0];
            slot.itemId = slotData.itemId;
        }

        this.setState({ equipmentSlots: this.state.equipmentSlots });
    }

    updateSlot(slotData: ItemSlot) {
        let slot = this.state.equipmentSlots.filter(x => x.id == slotData.slotId)[0];
        if (!slot) {
            return console.error("Could not get inventory view model slot with id", slotData.slotId);
        }

        slot.itemId = slotData.itemId;

        this.setState({ equipmentSlots: this.state.equipmentSlots });
    }

    toggle() {
        this.setState({ characterHidden: !this.state.characterHidden });
    }

    setLevel(level: number) {
        this.setState({ level });
    }

    setAttributes(attributes: Array<PlayerAttribute>) {
        this.setState({ attributes: attributes });
    }

    setMaxHealth(health: number) {
        this.setState({ maxHealth: health });
    }

    setMaxMana(mana: number) {
        this.setState({ maxMana: mana });
    }

    setPointsAvailable(points: number) {
        this.setState({ pointsToSpend: points });
    }

    setProtection(protection: number) {
        this.setState({ protection });
    }

    setDamage(damage: number) {
        this.setState({ damage });
    }

    private slotRightClick(e, slot: InventorySlot) {
        e.preventDefault();
        
        Inventory.unequipItem(slot.id);
    }

    private getStyleForItem(slot: InventorySlot) {
        let style = Ui.Inventory.getStyleForItem(slot.itemId);

        if (slot.itemId < 0) {
            style["background"] = "url(/css/images/equipment/item_bg_" + slot.type + ".png)"
        }

        return style;
    }

    private switchTab(tab: number) {
        this.setState({ tab });
    }

    private addAttribute(attr: PlayerAttribute) {
        if (this.state.pointsToSpend == 0) {
            return;
        }

        this.setState({ pointsToSpend: this.state.pointsToSpend - 1 });

        Network.spendAttributePoint({ id: attr.type });
    }
}