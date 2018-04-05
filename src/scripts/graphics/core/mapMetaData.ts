class Snap {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class Palette {
    defaultSize: number;
    variance?: number;
    snaps?: Array<Snap>;
}

class Hitbox {
    type: string;
    size?: number;
    w?: number;
    h?: number;
    x?: number;
    y?: number;
}

class HitboxCircle extends Hitbox {
    constructor(size: number) {
        super();

        this.type = "circle";
        this.size = size;
    }
}

class HitboxSquare extends Hitbox {
    constructor(w: number, h: number, x = 0, y = 0) {
        super();

        this.type = "square";
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
    }
}

class MetaData {
    solid: boolean;
    hitboxes?: Array<Hitbox>;
    hideOverhead?: boolean;
}

class MapData {
    name: string;
    id: number;
    meta?: MetaData;
    palette?: Palette;
}

const mapMetaData: Array<MapData> = [
    {
        name: "grassPositions",
        id: 1
    },
    {
        name: "grassDims",
        id: 2
    },
    {
        name: "tree",
        id: 101,
        meta: {
            solid: true,
            hitboxes: [
                new HitboxCircle(5)
            ]
        },
        palette: {
            variance: 3,
            defaultSize: 8
        }
    },
    {
        name: "cart",
        id: 102,
        meta: {
            solid: true,
            hitboxes: [
                new HitboxSquare(15, 10)
            ]
        },
        palette: {
            defaultSize: 4
        }
    },
    {
        name: "mausoleum",
        id: 103,
        meta: {
            solid: true,
            hitboxes: [
                new HitboxSquare(18, 20)
            ]
        },
        palette: {
            defaultSize: 5
        }
    },
    {
        name: "wallPost",
        id: 104,
        meta: {
            solid: true,
            hitboxes: [
                new HitboxSquare(2, 2)
            ]
        },
        palette: {
            defaultSize: 5,
            snaps: [
                new Snap(0, 0)
            ]
        }
    },
    {
        name: "wall",
        id: 105,
        meta: {
            solid: true,
            hitboxes: [
                new HitboxSquare(3, 23)
            ]
        },
        palette: {
            defaultSize: 5,
            snaps: [
                new Snap(0, 23),
                new Snap(0, -23)
            ]
        }
    },
    {
        name: "wallWithDoor",
        id: 106,
        meta: {
            solid: true,
            hitboxes: [
                new HitboxSquare(3, 6, 0, 17),
                new HitboxSquare(3, 6, 0, -17)
            ]
        },
        palette: {
            defaultSize: 5,
            snaps: [
                new Snap(0, 23),
                new Snap(0, -23)
            ]
        }
    },
    {
        name: "wallWithWindow",
        id: 107,
        meta: {
            solid: true,
            hitboxes: [
                new HitboxSquare(3, 23)
            ]
        },
        palette: {
            defaultSize: 5,
            snaps: [
                new Snap(0, 23),
                new Snap(0, -23)
            ]
        }
    },
    {
        name: "floorWood",
        id: 108,
        meta: {
            solid: false
        },
        palette: {
            defaultSize: 5,
            snaps: [
                new Snap(-69, 69),
                new Snap(69, 69),
                new Snap(-69, -69),
                new Snap(69, -69),
            ]
        }
    },
    {
        name: "roof",
        id: 109,
        meta: {
            solid: false,
            hideOverhead: true,
        },
        palette: {
            defaultSize: 5,
            snaps: [
                new Snap(-69, 69),
                new Snap(69, 69),
                new Snap(-69, -69),
                new Snap(69, -69),
            ]
        }
    },
    {
        name: "barrel",
        id: 110,
        meta: {
            solid: true,
            hitboxes: [
                new HitboxCircle(6)
            ]
        },
        palette: {
            defaultSize: 4
        }
    },
    {
        name: "bedPillow",
        id: 111,
        meta: {
            solid: true,
            hitboxes: [
                new HitboxSquare(23, 10)
            ]
        },
        palette: {
            defaultSize: 5
        }
    },
    {
        name: "crate",
        id: 112,
        meta: {
            solid: true,
            hitboxes: [
                new HitboxSquare(7, 7)
            ]
        },
        palette: {
            defaultSize: 5
        }
    },
]

export default mapMetaData;