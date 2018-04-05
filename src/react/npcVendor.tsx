import * as React from 'react';
import "../css/vendor.css";
import Ui from "../scripts/ui/_userInterface";
import Npcs from "../../shared/entities/list/npcList";
import NpcWare from "../../shared/entities/model/npcWare";
import Items from "../../shared/items/list/itemList";
import Network from "../scripts/core/_networkManager";

interface INpcVendorState {
    open: boolean;
    npcId: number;
    npcName: string;
    wares: Array<NpcWare>;
    selectedWare: NpcWare;
}

export class NpcVendor extends React.Component<{}, INpcVendorState> {
    constructor() {
        super();

        this.state = {
            open: false,
            npcId: -1,
            npcName: "Mr Nobody",
            wares: [],
            selectedWare: {itemId: -1, merchantBuyPrice: null, merchantSellPrice: null}
        }

        Ui.NpcVendor = this;
    }

    public render() {
        return <div id="npc-vendor" className={"ui-element" + (this.state.open ? "" : " hidden")}>
            <div id="npc-vendor-name">{this.state.npcName}</div>
            <div id="npc-vendor-items">
                {this.state.wares.map((ware, x) => {
                    let item = Items.get(ware.itemId);
                    let style = Ui.Inventory.getStyleForItem(ware.itemId);

                    return <div key={x}
                        className={"npc-vendor-item" + (ware.itemId == this.state.selectedWare.itemId ? " selected" : "")}
                        onClick={(e) => this.selectWare(e, ware)}
                        onContextMenu={(e) => this.selectWare(e, ware)}>

                        <div className="item-slot npc-vendor-item-icon"
                            style={style}
                            onMouseMove={(e) => Ui.Inventory.slotMouseMove(e)}
                            onMouseEnter={(e) =>  Ui.Inventory.slotMouseEnter(e, ware.itemId, true)}
                            onMouseLeave={(e) =>  Ui.Inventory.slotMouseLeave(e)}>
                            <div className="item-slot-outline"></div>
                        </div>

                        <div className="npc-vendor-item-name">{item.name}</div>
                        <div className="npc-vendor-item-price">
                            <div className="npc-vendor-item-price">
                                {ware.merchantSellPrice}
                                <div className="npc-vendor-item-price-icon"></div>
                            </div>
                        </div>
                    </div>
                })}
            </div>

            <div id="npc-vendor-cost">
                <div id="npc-vendor-cost-text">Cost</div>
                <div id="npc-vendor-cost-amount">{this.state.selectedWare.merchantSellPrice}</div>
            </div>
            <div id="npc-vendor-buy-button" onClick={(e) => this.buyWare()}>Buy</div>
            <div id="vendor-close" className="close" onClick={(e) => this.close()} />
        </div>;
    }

    public open(npcId: number) {
        let npc = Npcs.get(npcId);

        this.setState({ open: true, npcId, npcName: npc.name, wares: npc.wares });
    }

    public close() {
        this.setState({ open: false });
    }

    private selectWare(e, ware: NpcWare) {
        e.preventDefault();

        this.setState({ selectedWare: ware })

        //audio.playSoundBuffer("coinDrop");
    }

    private buyWare() {
        if (this.state.selectedWare.itemId < 0) {
            return;
        }
        
        Network.buyItem({ merchantId: this.state.npcId, itemId: this.state.selectedWare.itemId });
    }
}
