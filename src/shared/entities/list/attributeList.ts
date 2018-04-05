interface Attribute {
    id: number;
    name: string;
}

export default class Attributes {

    static get Strength() { return 1 }
    static get Speed() { return 2 }
    static get Vitality() { return 3 }
    static get Knowledge() { return 4 }
    static get Spirit() { return 5 }
    static get Luck() { return 6 }

    static list(): Array<Attribute> {
        return attributes;
    }

    static getById(id: number): Attribute {
        let attr = attributes.filter(x => x.id == id)[0];
        return attr;
    }

    static getByName(name: string): Attribute {
        let attr = attributes.filter(x => x.name == name)[0];
        return attr;
    }
}

const attributes: Array<Attribute> = [
    { id: Attributes.Strength, name: "Strength" },
    { id: Attributes.Speed, name: "Speed" },
    { id: Attributes.Vitality, name: "Vitality" },
    { id: Attributes.Knowledge, name: "Knowledge" },
    { id: Attributes.Spirit, name: "Spirit" },
    { id: Attributes.Luck, name: "Luck" },
];