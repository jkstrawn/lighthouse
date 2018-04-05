import * as React from 'react';
import Ui from "../scripts/ui/_userInterface";
import Network from "../scripts/core/_networkManager";

interface ILootBagState {
    open: boolean;
    inventory: Array<number>;
    lootBagId: number;
}

export class LootBag extends React.Component<{}, ILootBagState> {

    constructor() {
        super();

        this.state = {
            open: false,
            inventory: [],
            lootBagId: 0
        };

        Ui.LootBag = this;
    }

    public render() {
        return <div id="loot-bag" className={"ui-element popup-box" + (this.state.open ? "" : " hidden")}>

            {this.state.inventory.map((itemId, x) => {
                let style = Ui.Inventory.getStyleForItem(itemId);

                return <div key={x}
                    className="item-slot loot-slot"
                    style={style}
                    onClick={(e) => this.clickItem(e, x)}
                    onContextMenu={(e) => this.clickItem(e, x)}>
                    <div className="item-slot-outline"></div>
                </div>
            })}
        </div>
    }

    public open(lootBagId: number, items: Array<number>) {
        let inventory = this.fillEmptySlots(items);

        this.setState({ open: true, inventory, lootBagId });
    }

    public refresh(items: Array<number>) {
        let inventory = this.fillEmptySlots(items);

        this.setState({ inventory: inventory });
    }

    public close() {
        this.setState({ open: false });
    }

    private clickItem(e, index: number) {
        e.preventDefault();
        
        Network.lootItem({containerId: this.state.lootBagId, slotId: index});
        //$itemToolTip.hide();
    }

    private fillEmptySlots(inventory: Array<number>): Array<number> {
        let inv = [...inventory];

        for (let i = inv.length; i < 6; i++) {
            inv.push(-1);
        }

        return inv;
    }
}
