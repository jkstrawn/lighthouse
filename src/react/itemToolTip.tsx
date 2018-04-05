import * as React from 'react';
import Ui from "../scripts/ui/_userInterface";
import Item from "../../shared/items/model/item";
import ItemTypes from "../../shared/items/enum/itemTypeEnum";
import Npcs from "../../shared/entities/list/npcList";
import { StringHelper } from "../../shared/helpers/helpers";

interface IItemToolTipState {
    sellPrice: number;
    type: string;
    statLabel: string;
    statValue: string;
    itemName: string;
    hidden: boolean;
    x: number;
    y: number;
    merchantWare: boolean;
}

export class ItemToolTip extends React.Component<{}, IItemToolTipState> {
    constructor() {
        super();

        this.state = {
            hidden: true,
            type: "",
            statLabel: "",
            statValue: "",
            itemName: "",
            x: 0,
            y: 0,
            merchantWare: false,
            sellPrice: -1
        }

        Ui.ItemToolTip = this;
    }

    public render() {
        let style = {top: this.state.y + "px", left: this.state.x + "px"};

        return <div id="item-tooltip" className={"ui-element popup-box" + (this.state.hidden ? " hidden" : "")} style={style}>
            <div id="item-tooltip-name">{this.state.itemName}</div>
            <div id="item-tooltip-type" className="item-tooltip-field">
                <div id="item-tooltip-type-label">Type</div>
                <div className="item-tooltip-colon">:</div>
                <div id="item-tooltip-type-value">{StringHelper.capitalize(this.state.type)}</div>
            </div>
            <div id="item-tooltip-stat" className="item-tooltip-field">
                <div id="item-tooltip-stat-label">{this.state.statLabel}</div>
                <div className="item-tooltip-colon">:</div>
                <div id="item-tooltip-stat-value">{this.state.statValue}</div>
            </div>
            <div id="item-tooltip-sell-price" className={"item-tooltip-field" + (this.state.sellPrice > 0 && !this.state.merchantWare ? "" : " hidden")}>
                <div className="item-tooltip-colon">Sell Price:</div>
                <div id="item-tooltip-sell-price-value">{this.state.sellPrice}</div>
                <div id="item-tooltip-sell-price-icon"></div>
            </div>
        </div>;
    }

    public setItem(item: Item, merchantWare: boolean) {
        let sellPrice = -1;

        if (Ui.NpcVendor.state.open) {
            sellPrice = item.defaultSellPrice;
            
            let npc = Npcs.get(Ui.NpcVendor.state.npcId);
            let ware = npc.wares.filter(x => x.itemId == item.id)[0];
            if (ware) {
                sellPrice = ware.merchantBuyPrice;
            }
        }

        this.setState({ hidden: false, sellPrice, merchantWare, type: item.type, itemName: item.name });

        this.setItemStats(item);
    }

    public setPosition(x: number, y: number) {
        this.setState({x, y});
    }

    public hide() {
        this.setState({hidden: true});
    }

    private setItemStats(item: Item) {
        switch (item.type) {
            case ItemTypes.Consumeable:
                return this.setState({ statLabel: "Health", statValue: item.healthRestore.toString() });
            case ItemTypes.Weapon:
                return this.setState({ statLabel: "Damage", statValue: item.damage.toString() });
            case ItemTypes.Trash:
                return this.setState({ statLabel: "", statValue: "" });
            default:
                return this.setState({ statLabel: "Protection", statValue: item.protection.toString() });
        }
    }
}
