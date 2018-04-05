import EntityTypes from "../entities/enum/entityTypeEnum";

class Projectile {
    name: string = "";
    speed: number = 0;
    gravity: number = 2;

    constructor(name: string, speed: number, gravity: number) {
        this.name = name;
        this.speed = speed;
        this.gravity = gravity;       
    }
}

export default class Projectiles {
    static getByName(name: string) : Projectile {
        return projectiles.filter(x => x.name == name)[0];
    }
};

let projectiles = [
    new Projectile(EntityTypes.ProjectileSlime, 100, 2),
    new Projectile(EntityTypes.ProjectileStar, 140, 2),
];