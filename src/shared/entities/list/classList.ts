import PlayerClass from "../model/playerClass";

export default class Classes {

    static get Knight() { return 1 }
    static get Mystic() { return 2 }

    static list(): Array<PlayerClass> {
        return classes;
    }

    static getById(id: number): PlayerClass {
        let attr = classes.filter(x => x.id == id)[0];
        return attr;
    }

    static getByName(name: string): PlayerClass {
        let attr = classes.filter(x => x.name == name)[0];
        return attr;
    }
}

const classes: Array<PlayerClass> = [
    { id: Classes.Knight, name: "Knight" },
    { id: Classes.Mystic, name: "Mystic" },
];