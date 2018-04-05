import PlayerAttribute from "./model/playerAttribute";
import Attributes from "./list/attributeList";

export default class PlayerAttributes {
    private attributes: Array<PlayerAttribute>;

    constructor(attributes: Array<PlayerAttribute>) {
        this.attributes = attributes;
    }

    get(id: number): PlayerAttribute {
        return this.attributes.filter(x => x.type == id)[0];
    }

    list() {
        return this.attributes;
    }

    getStrength(): number {
        return this.get(Attributes.Strength).value;
    }

    getSpeed(): number {
        return this.get(Attributes.Speed).value;
    }

    getVitality(): number {
        return this.get(Attributes.Vitality).value;
    }

    getKnowledge(): number {
        return this.get(Attributes.Knowledge).value;
    }

    getSpirit(): number {
        return this.get(Attributes.Spirit).value;
    }

    getLuck(): number {
        return this.get(Attributes.Luck).value;
    }
}